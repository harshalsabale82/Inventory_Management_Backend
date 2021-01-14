const express= require("express");
const router=express.Router();
const {voucher}=require("./collection/voucherSchema");

router.post("/newVoucher",async(req,res)=>{
    var doc =await voucher.find({},{'voucherNo':1,'_id':0}).sort({'_id':-1}).limit(1);
    var voucherNumber;
        if(doc[0]==null){
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
                res.send(result);
            } catch (error) {
                res.send(error);
            }
                
});

router.get("/Voucher",async(req,res)=>{
        try {
            var result=await voucher.find({});
            res.send(result);    
        } catch (error) {
            res.send(error);
        }         
});

module.exports = router;
 