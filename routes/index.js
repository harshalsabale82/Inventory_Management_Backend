var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.sendFile("Hello");
});

router.post("/uploads",(req,res)=>{
 var data;
  res.redirect("/");
});

module.exports = router;
