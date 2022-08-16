const csv = require('csv');
const now = require('performance-now');
const fs = require('fs');
const path = require('path');

const pool = require('../database/index');
const getInputFileStream = (fileName) => {
  fs.createReadStream(path.join(__dirname, `legacy_data/${fileName}.csv`));
};
const load = require('./load');

const option = {
  product: {
    tableName: 'sdc.products',
    colNames: 'id,name,slogan,description,category,default_price',
  },
  reviews: {
    tableName: 'sdc.reviews',
    colNames: 'id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness',
  },
  reviews_photos: {
    tableName: 'sdc.photos',
    colNames: 'id,review_id,url',
  },
  characteristics: {
    tableName: 'sdc.characteristics',
    colNames: 'id,product_id,name',
  },
};

const ETL = () => load.copy(pool, 'product_test', option.product)
  .then(() => load.copy(pool, 'reviews_test', option.reviews))
  .then(() => load.copy(pool, 'reviews_photos_test', option.reviews_photos))
  .then(() => load.copy(pool, 'characteristics_test', option.characteristics))
  .catch((err) => {
    throw(err);
  });

const revChar = (fileName) => {
  const start = now();

  const max = 10000;
  var count = 0;
  var obj = {};
  const stream = extract.getInputFileStream(fileName)
    .pipe(csv.parse({ delimiter: '', from_line: 2 }))
    .on('data', async (row) => {
      count++;
      const charId = row[1];
      const value = Number(row[3]);

      if (charId && value) {
        if (obj[charId]) {
          obj[charId].value_total += value;
          obj[charId].value_count++;
        } else {
          obj[charId].value_total = value;
          obj[charId].value_count = 1;
        }
      }

      if (count >= max) {
        stream.pause();
        await load.update(pool, 'obj', option.characteristics);
        // reset
        count = 0;
        obj = {};
        stream.resume();
      }

    });
};

ETL()
  .then(() => { revChar('characteristic_reviews'); })
  .catch((err) => { console.error(err); });