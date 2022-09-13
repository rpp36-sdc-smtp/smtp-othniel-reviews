const csv = require('csv');
const now = require('performance-now');
const fs = require('fs');
const path = require('path');

const pool = require('../database/index');
const getInputFileStream = (fileName) => {
  fs.createReadStream(path.join(__dirname, `csv/${fileName}.csv`));
};
const load = require('./load');

const option = {
  product: {
    tableName: 'products',
    colNames: 'id,name,slogan,description,category,default_price',
  },
  reviews: {
    tableName: 'reviews',
    colNames: 'id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness',
  },
  reviews_photos: {
    tableName: 'photos',
    colNames: 'id,review_id,url',
  },
  characteristics: {
    tableName: 'characteristics',
    colNames: 'id,product_id,name',
  },
  characteristicreview: {
    tableName: 'characteristicreview',
    colNames: 'id,characteristic_id,review_id,value'
  },
};

const ETL = () => load.copy(pool, 'product', option.product)
  .then(() => load.copy(pool, 'reviews', option.reviews))
  .then(() => load.copy(pool, 'reviews_photos', option.reviews_photos))
  .then(() => load.copy(pool, 'characteristics', option.characteristics))
  .then(() => load.copy(pool, 'characteristic_reviews', option.characteristicreview))
  .then(async function setVals() {
    try {
      await pool.query('SELECT setval ("reviews_id_seq", (SELECT max(id) FROM reviews) + 1)');
      await pool.query('SELECT setval ("photos_id_seq", (SELECT max(id) FROM photos) + 1);');
      await pool.query('SELECT setval ("characteristicreview_id_seq", (SELECT max(id) FROM characteristicreview) + 1);');
    } catch(err) {
      throw err;
    }
  })
  .catch((err) => {
    throw(err);
  });

ETL()
  .catch((err) => { console.error(err); });