var express = require('express');
var router = express.Router();
var path=require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join("/home/shinigami/Documents/Dixit/Inventory_Management_Backend/views/index.html"));
});

router.post("/uploads",(req,res)=>{
  console.log(req.files.file.data);
  res.send(req.files);
});

module.exports = router;
