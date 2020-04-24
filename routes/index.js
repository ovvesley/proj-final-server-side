var express = require('express');
var router = express.Router();
/**
 * @swagger
 * /:
 *  get: 
 *    description: use to test
 *    responses:
 *      '200': 
 *        description: Hello world. I fucking hate my life
 *    
 */
router.get('/', function(req, res, next) {
  res.redirect(process.env.HORTA_FRONT_URL)
});

module.exports = router;
