const express=require("express");
const Crypt= require("cryptr");
const saltedCrypt= new Crypt("Thisisthesaltforthepassword");
const router=express.Router();
const {employee}=require("./collection/Schemas");
const {attendee}=require("./collection/Schemas");
const multer=require("multer");
const path=require("path");
const fs=require("fs");

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        var dirpath= "./uploads/"+req.body.userid;
        
        if(!fs.existsSync(dirpath)){
           return fs.mkdirSync(dirpath,error=> callback(error,dirpath));
           console.log(dirpath);
        }
        callback(null,dirpath)
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});

const upload=multer({storage});

// make resgistration of the employee
router.post("/registration",upload.any(),async(req,res)=>{
    var hashedPassword= saltedCrypt.encrypt(req.body.password);
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
                                    attendance:"",
                                    present:0,
                                    halfDay:0,
                                    absent:0
                                    });

    empschema
        .save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
            res.send(500).json({
                error: err,
            });
        });

    attendanceSchema
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Employee and Attendee created successfully"})
        })
        .catch((err) => {
            console.log(err);
            res.send(500).json({
                error: err,
            });
        });
        
});

const updateImage=multer.diskStorage({
    destination:(req,file,callback)=>{
        var photo=employee.findOne({_id:req.body._id},{"photo":1});
        var photoid=employee.findOne({_id:req.body._id},{"photoid":1});
        var userid=employee.findOne({_id:req.body._id},{"photoid":1});

        var dirpath= "./uploads/"+req.body.userid;

        if(userid!=req.body.userid){
            var newpath="./uploads"+userid;
            fs.renameSync(dirpath,newpath);
            dirpath=newpath;
        }

        if(photo!=req.photo){
            fs.unlink(result.photo);
        }
        if(photoid!=req.photoid){
            fs.unlink(result.photoid);
        }
        callback(null,dirpath);
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});

var update=multer({updateImage});

router.put("/update",update.any(),async(req,res)=>{
    var hashedPassword= saltedCrypt.encrypt(req.body.password);
    var photopath,photoid;   
    console.log(req.body);
    console.log(req.files[0]);
    var getDoc={_id:req.body._id};
    
    var updatedValues={$set:{   fullName: req.body.fullName, 
                                address: req.body.address, 
                                contactNo: req.body.contactNo,
                                department:req.body.department,
                                designation:req.body.designation,
                                password: hashedPassword
                                }};
    
    try {
        var result= await employee.updateOne(getDoc,updatedValues,(err,res)=>{
            if(err)
                throw err;
            else
            console.log("updated")
        });
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.put("/attendance",async(req,res)=>{
try{
    var obj=[];
    for(var i=0;i<Object.keys(req.body).length;i++){
        var getDoc=req.body[i]._id
        
        if(req.body[i].Attendance.value==1){
            var updatedValues= {$push:{attendance:{date:req.body[i].Attendance.date,value:req.body[i].Attendance.value}},$inc:{present:1}};
        }else if(req.body[i].Attendance.value==0){   
            var updatedValues= {$push:{attendance:{date:req.body[i].Attendance.date,value:req.body[i].Attendance.value}},$inc:{halfDay:1}};
        }else{
            var updatedValues= {$push:{attendance:{date:req.body[i].Attendance.date,value:req.body[i].Attendance.value}},$inc:{absent:1}};
        }

        var obj1= await attendee.updateOne({_id:getDoc},updatedValues);
        obj.push(obj1);
    }
    res.status(200).json({
        message:"Attendance marked"
    });
}catch(error){
    res.send(error);
}
});

router.delete("/delete",async(req,res)=>{
       var dirname=employee.findOne({_id:req.params},{'userid':1});
       fs.rm('./uploads'+dirname,{recursive:true,force:true});
         employee.deleteOne({_id:req.params}).then((err)=>{
                if(!err){
                    return "Entry deleted Successfully!";
                }else{
                    return err;
                }        
        });

            attendee.deleteOne({_id:req.params}).then((err)=>{
                if(err){
                    res.send(err);
                }else{
                    res.send(200).json({
                        message: "Entry deleted Successfully!"
                })
                }
            })

        res.send(response);
});

router.get("/",async(req,res)=>{
    var result = await employee.find({});
    for(var i=0;i<result.length;i++){
        var decryptedPassword=saltedCrypt.decrypt(result[i].password);
        result[i].password=decryptedPassword;
    }
    res.send(result); 
})

router.get("/attendance",async(req,res)=>{
    var result = await attendee.find({});
    res.send(result);
});


module.exports=router; 