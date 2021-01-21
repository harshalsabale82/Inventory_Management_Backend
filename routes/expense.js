const express=require("express");
const router=express.Router();
const {dailyExpense}=require("./collection/Schemas");
const multer= require("multer");
const fs= require("fs");

const storage= multer.diskStorage({
    destination: async(req,file,callback)=>{
        var dirPath= "./uploads/expenseReciept";
        callback(null,dirPath);
    },
    filename: async(req,file,callback)=>{
            callback(null,Date.now()+'-'+file.originalname)
    }
});

const upload= multer({storage})
router.post("/newVoucher",upload.any(),async(req,res)=>{
    
    var getVoucher= await dailyExpense.find({},{"voucherNo":1,"_id":0}).sort({"_id":-1}).limit(1)
    var newVoucherNo;
    console.log(getVoucher)
        if(getVoucher.length==0){
            newVoucherNo=1;
        }else{
         newVoucherNo= ++getVoucher[0].voucherNo;
        }

        const newVoucher = new dailyExpense({
                                       voucherNo: newVoucherNo,
                                       dateOfVoucher: req.body.dateOfExpense,
                                       amountPaid: req.body.amountPaid,
                                       paidTo: req.body.paidTo,
                                       paidBy: req.body.paidBy,
                                       remark: req.body.remark,
                                       paymentMode: req.body.paymentMode,
                                       paymentSource: req.body.paymentSource,
                                       photo: req.files[0].path
        });

        try {
           var result  = await newVoucher.save();
             res.json({"status":200,"Messagae":"Created Entry Successfully","response":result})
        } catch (error) {
             res.json({"error":error})
        }

});

router.get("/",async(req,res)=>{
    try {
        var result = await dailyExpense.find({});
            if(result !== null){
                res.send(result);
            }else{
                res.json({"Message":"No voucher found "})
            }
    } catch (error) {
        res.json({"error":error});
    }
});

router.delete("/deleteVoucher/:id",async(req,res)=>{
    try {
        await dailyExpense.findByIdAndDelete(req.params.id);
        res.json({"status":202,"Message":"Voucher deleted!"});
    } catch (error) {
        res.json({"error":error});
    }
});

module.exports= router;