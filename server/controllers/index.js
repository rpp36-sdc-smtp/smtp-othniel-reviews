// explain analyze for query info
const pool = require('../../database/index');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
module.exports = {
  reviews: {
    get: function (req, res) {
      let orderBy = 'order by helpfulness desc';
      if (req.query.sort === 'newest') {
        orderBy = 'order by date desc';
      }
      if (!req.query.product_id) {
        res.send('Error: invalid product_id provided');
      } else {
        let { product_id } = req.query;
        let result = {
          product: product_id,
          page: req.query.page || 0,
          count: req.query.count || 5,
        };
        pool.query(`select review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness from reviews left outer join photos on photos.review_id = reviews.id where product_id = ${product_id} ${orderBy}`)
          .then(async (result) => {
            const reviews = result.rows.slice();
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
            res.send(reviews);
          }).catch((err) => {
            res.send(err);
          });
      }
    },
    post: function (req, res) {
      // code
      res.send('reviews post');
    }
  },

  meta: {
    get: function (req, res) {
      // code
      res.send('meta get');
    },
    post: function (req, res) {
      // code
      res.send('meta post');
    }
  },
};