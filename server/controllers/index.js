// explain analyze for query info
module.exports = {
  reviews: {
    get: function (req, res) {
      // code
      // select * from reviews left outer join photos on photos.review_id = reviews.id where product_id = ${productID} + sort
      res.send('reviews');
    },
    post: function (req, res) {
      // code
      res.send('reviews');
    }
  },

  meta: {
    get: function (req, res) {
      // code
      res.send('meta');
    },
    post: function (req, res) {
      // code
      res.send('meta');
    }
  },
};