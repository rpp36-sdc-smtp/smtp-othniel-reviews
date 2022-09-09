var controller = require('./controllers');
var router = require('express').Router();

router.get('/reviews', controller.reviews.get);
router.post('/reviews', controller.reviews.post);
router.get('/reviews/meta', controller.meta.get);
router.post('/reviews/meta', controller.meta.post);

module.exports = router;