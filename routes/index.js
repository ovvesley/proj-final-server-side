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
  res.json({hello: "world"})
});

module.exports = router;
