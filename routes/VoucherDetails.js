const express= require("express");
const router=express.Router();
const {voucher}=require("./collection/Schemas")

router.post("/",async(req,res)=>{
    var newVoucher= new voucher({
                                voucherNo: req.body.voucherNo,
                                date: req.body.date,
                                eventCompany: req.body.eventCompany,
                                venue: req.body.venue,
                                contactPersonName: req.body.contactPersonName,
                                contactPersonNumber: req.body.contactPersonNumber,
                                team: req.body.team,
                                vehicle: req.body.vehicle
                                });

            try {
                var result = newVoucher.save();
                res.send("Success!");
            } catch (error) {
                res.send(error);
            }
});

router.get("/",async(req,res)=>{
        try {
            var result=voucher.find({});
            res.sendDate(result);    
        } catch (error) {
            res.send(error);
        }         
});

module.exports = router;
