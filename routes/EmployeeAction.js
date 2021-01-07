const express=require("express");
const Crypt= require("cryptr");
const saltedCrypt= new Crypt("Thisisthesaltforthepassword");
const router=express.Router();
const {employee}=require("./collection/Schemas");
const {attendee}=require("./collection/Schemas");
const fs= require('fs');
const path=require('path');
const multer=require("multer");
const formData= require("form-data");

var dirpath="/home/shinigami/Documents/Dixit/Images/"

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        
        fs.mkdir(path.join(dirpath,req.body.userid),err=>{});
        callback(null,dirpath+req.body.userid);
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});

 const uploads=multer({storage:storage});
 
// make resgistration of the employee
router.post("/registration",uploads.any(),async(req,res)=>{
    var hashedPassword= await saltedCrypt.encrypt(req.body.password);
    
    var empschema=new employee({
                                dateofjoining:req.body.dateofjoining,
                                fullName:req.body.fullName,
                                address:req.body.address,
                                contactno: req.body.contactno,
                                department:req.body.department,
                                designation:req.body.designation,
                                userid:req.body.userid,
                                password :hashedPassword,
                                photo:req.files[0].path,
                                photoid:req.files[1].path
                                });


    var attendanceSchema= new attendee({
                                    _id:empschema._id,
                                    userId:req.body.userid,
                                    attendance:""
                                    });
var obj=[]

        try {

            const result1= await empschema.save((err,response)=>{
                if(err){
                    console.log(err);
                }else{
                    return response;
                }
           });

             const result2= await attendanceSchema.save((err,response)=>{
                if(err){
                    console.log(err);
                }else{
                    return response;
                }
            });
            obj.push(result1);
            obj.push(result2);
            res.send(obj);
            
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

router.put("/attendance",async(req,res)=>{
    var obj=[];
    for(var i=0;i<Object.keys(req.body).length;i++){
        var getDoc=req.body[i]._id
       var updatedValues= {$push:{attendance:{date:req.body[i].Attendance.date,value:req.body[i].Attendance.value}}};

        var obj1= await attendee.updateOne({_id:getDoc},updatedValues);
        obj.push(obj1);
    }

    res.send(obj);
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
  let doc=[];  
  var result= await employee.find({});

    for(var i=0;i<result.length;i++){
        var form= new formData();

        var decryptedPassword=saltedCrypt.decrypt(result[i].password);
        form.append("_id",JSON.stringify(result[i]._id))
        form.append("dateofjoining",JSON.stringify(result[i].dateofjoining))
        form.append("fullName",result[i].fullName);
        form.append("address",result[i].address);
        form.append("contactno",result[i].contactno);
        form.append("department",result[i].department);
        form.append("designation",result[i].designation);
        form.append("userid",result[i].userid);
        form.append("password",decryptedPassword);
        form.append("photo",fs.createReadStream(result[i].photo,{encoding:"base64"}));
        form.append("photoId",fs.createReadStream(result[i].photoid,{encoding:"base64"}));
        doc.push(form);
    }
       res.send(doc); 
})

router.get("/attendance",async(req,res)=>{
    var result = await attendee.find({});
     res.send(result);
});


module.exports=router; 