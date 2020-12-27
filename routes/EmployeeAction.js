const express=require("express");
const mongoose=require("mongoose");
const Crypt= require("cryptr");
const saltedCrypt= new Crypt("Thisisthesaltforpassword");
const router=express.Router();
const {employee}=require("./collection/Schemas");


router.post("/registration",async(req,res)=>{
    var hashedPassword= await saltedCrypt.encrypt(req.body.password);
    
    var empschema=new employee({
                                  dateofjoining: req.body.dateofjoining,
                                  fullName: req.body.fullName,
                                  address:req.body.address,
                                  contactno: req.body.contactno,
                                  department:req.body.department,
                                  designation:req.body.designation,
                                  userid: req.body.userid,
                                  password: hashedPassword,
                                  photo: req.body.photo,
                                  photoid: req.body.photoid
                                });

        try {
            const result= await empschema.save();
            res.send(result);
            console.log(result);
        } catch (error) {
            res.send(error);
        }
});

router.put("/update",async(req,res)=>{
    var hashedPassword= await saltedCrypt.encrypt(req.body.password);

    var getDoc={_id:req.body._id};
    var updatedValues={$set:{fullName: req.body.fullName,contactNo: req.body.contactNo,
                            password: hashedPassword}};
    
        try {
           var result= await employee.updateOne(getDoc,updatedValues);
           res.send(result);
        } catch (error) {
            res.send(error);
        }
});

router.delete("/delete/:_id",async(req,res)=>{

        var response=await employee.deleteOne({_id:req.params}).then((err)=>{
                if(!err){
                    return "Entry deleted Successfully!";
                }else{
                    return err;
                }
        });

        res.send(response);
});

router.get("/",async(req,res)=>{
  var result= await employee.find({});
       res.send(result); 
})



module.exports=router;