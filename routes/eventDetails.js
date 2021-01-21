const express= require("express");
const router=express.Router();
const {voucher}=require("./collection/Schemas");
const multer =require("multer");
const fs =require("fs");

const storage =multer.diskStorage({
    destination: async(req,file,callback)=>{ 
        var dirPath='./uploads/voucherImages/'+req.body.voucherNo;
        if(fs.existsSync(dirPath)){
          console.log("directory already present");
        }else{
            fs.mkdirSync(dirPath,err=>{console.log(err)})
        }
        callback(null,dirPath);
    },
    filename:async(req,file,callback)=>{
        callback(null,)
    }
})

router.post("/newVoucher",async(req,res)=>{
    var doc =await voucher.find({},{'voucherNo':1,'_id':0}).sort({'_id':-1}).limit(1);
    var voucherNumber;
        if(doc.length==0){
            voucherNumber=1
        }else{
          voucherNumber=++doc[0].voucherNo
        }
    var newVoucher= new voucher({
                                voucherNo:voucherNumber,
                                dateOfVoucher: req.body.dateOfVoucher,
                                eventCompany: req.body.eventCompany,
                                venue: req.body.venue,
                                contactPersonName: req.body.contactPrsnName,
                                contactPersonMobile: req.body.contactPrsnMob,
                                team: req.body.crew,
                                vehicle: req.body.vehicle
                                });                        

            try {
                var result = await newVoucher.save();
                    if(result!=null){
                        res.json({"Message":"Voucher Created Successfully","result":result})
                    }else{
                         res.json({"error":"Request Failed"})
                    }
            } catch (error) {
                res.json({"error":error});
            }
                
});

router.get("/",async(req,res)=>{
    var result
        try {
           if(req.body === null){ 
                 result= await voucher.find({});
                 res.send(result);
           }else{
               if(req.body.endDate === null){
                 result= await voucher.aggregate({$gte:req.body.startDate});
                 res.send(result);
               }else if(req.body.startDate === null){
                result= await voucher.aggregate({$lte:req.body.endDate});
                res.send(result);
               }else{
                result= await voucher.aggregate({$gte:req.body.startDate,$lte:req.body.endDate});
                res.send(result);
               }
           }    
        } catch (error) {
            res.send(error);
        }         
});

router.delete("/deleteEvent/:id",async(req,res)=>{
    try {
        await voucher.findByIdAndDelete(req.params.id);
        res.json({"status":202,Message:"Event deleted"})
    } catch (error) {
        res.json({"error":error});
    }
});

module.exports = router;
 