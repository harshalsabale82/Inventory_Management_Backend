const express= require("express");
const router=express.Router();
const {voucher}=require("./collection/voucherSchema");

router.post("/newVoucher",async(req,res)=>{
    console.log(req.body);
    var newVoucher= new voucher({
                                voucherNo: req.body.voucherNo,
                                dateOfVoucher: req.body.dateOfVoucher,
                                eventCompany: req.body.eventCompany,
                                venue: req.body.venue,
                                contactPersonName: req.body.contactPrsnName,
                                contactPersonMobile: req.body.contactPrsnMob,
                                team: req.body.crew,
                                vehicle: req.body.vehicle
                                });

            try {
                var result =await newVoucher.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                });
                res.send(result);
            } catch (error) {
                res.send(error);
            }
});

router.get("/Voucher",async(req,res)=>{
        try {
            var result=voucher.find({});
            res.sendDate(result);    
        } catch (error) {
            res.send(error);
        }         
});

module.exports = router;
 