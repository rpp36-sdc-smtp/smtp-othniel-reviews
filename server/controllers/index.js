// explain analyze for query info
const pool = require('../../database/index');
module.exports = {
  reviews: {
    get: function (req, res) {
      let orderBy = 'order by helpfulness desc';
      if (req.query.sort === 'newest') {
        orderBy = 'order by date desc';
      }
      if (!req.query.product_id || !parseInt(req.query.product_id)) {
        res.status(400).send('Error: invalid product_id provided');
      } else {
        let { product_id } = req.query;
        let result = {
          product: product_id,
          page: req.query.page || 0,
          count: req.query.count || 5,
        };
        pool.query(`select review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness from reviews left outer join photos on photos.review_id = reviews.id where product_id = ${product_id} ${orderBy}`)
          .then(async (data) => {
            const reviews = data.rows.slice();
            const photosPromise = reviews.map((review) => {
              return pool.query(`select id, url from photos where review_id = ${review.review_id}`)
                .then((data) => data.rows)
                .catch((err) => { throw err; });
            });
            const photos = await Promise.all(photosPromise)
              .then((photo) => photo)
              .catch((err) => { throw err; });

            for (var i = 0; i < reviews.length; i++) {
              const review = reviews[i];
              const photo = photos[i];

              review.photos = photo;
              review.date = new Date(Number(review.date));

              reviews[i] = review;
            }
            result.results = reviews;
            res.send(result);
          }).catch((err) => {
            res.send(err);
          });
      }
    },
    post: function (req, res) {
      if (!parseInt(req.body.product_id)) {
        res.sendStatus(400);
      } else {
        let submit = req.body;
        let { photos, characteristics } = submit;
        let result = {};
        const revQuery = {
          text: 'insert into reviews (reviewer_name, reviewer_email, rating, summary, recommend, body, date, product_id) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id',
          values: [submit.name, submit.email, Number(submit.rating), submit.summary, Boolean(submit.recommend), submit.body, Date.now(), submit.product_id],
        };
        const charQuery = {
          text: 'insert into characteristicreview (characteristic_id, review_id, value) values',
        };
        const photoQuery = {
          text: 'insert into photos (url, review_id) values',
        };
        pool.query(revQuery)
          .then(async function test(data) {
            result.review_id = data.rows[0].id;
            for (const [key, value] of Object.entries(submit.characteristics)) {
              charQuery.text += ` (${key}, ${result.review_id}, ${value}),`;
            }
            charQuery.text = charQuery.text.substring(0, charQuery.text.length - 1);
            try {
              await pool.query(charQuery.text);
            } catch(err) {
              throw err;
            }
            if (photos.length > 0) {
              photos.forEach(photo => {
                photoQuery.text += `('${photo}', ${result.review_id}),`;
              });
              photoQuery.text = photoQuery.text.substring(0, photoQuery.text.length - 1);
              try {
                await pool.query(photoQuery.text);
              } catch(err) {
                throw err;
              }
            }
            res.status(201).send('Created');
          }).catch((err) => {
            res.status(500).send(err);
          });
      }
    },
    helpful: function (req, res) {
      let { review_id } = req.params;
      let col = 'helpfulness';
      helper(review_id, col)
        .then(() => {
          res.status(204).send('No Content');
        }).catch((err) => {
          res.status(500).send(err);
        });
    },
    report: function (req, res) {
      let { review_id } = req.params;
      let col = 'report';
      helper(review_id, col)
        .then(() => {
          res.status(204).send('No Content');
        }).catch((err) => {
          res.status(500).send(err);
        });
    }
  },
  meta: {
    get: function (req, res) {
      let { product_id } = req.query;

      const ratingQueryStr = `select rating, count(*) from reviews where product_id=${product_id} and reported=false group by rating;`;

      const recommendQueryStr = `select recommend, count(*) from reviews where product_id=${product_id} and reported=false group by recommend;`;

      const charQueryStr = `select characteristic_id, name, avg(value) as value from characteristicreview rv join characteristics char on char.id=rv.characteristic_id join reviews r on r.id=rv.review_id where r.reported=false and char.product_id=${product_id} group by characteristic_id, name;`;

      const rating = pool.query(ratingQueryStr);
      const rec = pool.query(recommendQueryStr);
      const char = pool.query(charQueryStr);
      Promise.all([rating, rec, char])
        .then((result) => {
          let [rating, recommend, char] = result;
          rating = format(rating.rows);
          recommend = format(recommend.rows);
          char = charFormat(char.rows);
          const endRes = {};
          endRes.product_id = product_id;
          endRes.ratings = rating;
          endRes.recommended = recommend;
          endRes.characteristics = char;
          res.status(200).send(endRes);
        });
    },
  },
};

helper = (id, col) => {
  let query = '';
  if (col === 'helpfulness') {
    query = `update reviews set helpfulness=helpfulness+1 where id=${id}`;
  }
  if (col === 'report') {
    query = `update reviews set reported=true where id=${id}`;
  }
  return pool.query(query).catch((err) => { throw err; });
};

format = (arr) => {
  if (arr.length === 0) {
    return {};
  }
  if (arr[0].rating) {
    ratings = {};
    arr.forEach(obj => {
      ratings[obj.rating] = obj.count;
    });
    return ratings;
  } else {
    recommended = {};
    arr.forEach(obj => {
      recommended[obj.recommend] = obj.count;
    });
    return recommended;
  }
};

charFormat = (arr) => {
  let char = {};
  arr.forEach(obj => {
    let inner = {};
    inner.id = obj.characteristic_id;
    inner.value = obj.value;
    char[obj.name] = inner;
  });
  return char;
};