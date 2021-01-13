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
    destination:async(req,file,callback)=>{
            
        var dirpath= "./uploads/"+req.body.userid;
        
        if(fs.existsSync(dirpath)==true){
        var photoPath = await employee.findOne({_id:req.body._id},{'photo':1,'photoid':1,'_id':0}); 
            if(file.fieldname === 'photo'){
                if(photoPath !==null){ 
                    fs.rm(photoPath.photo,(err)=>{
                        console.log(err)
                    });
                }   
            } else if(file.fieldname ==='photoId'){
                if(photoPath !==null){ 
                    fs.rm(photoPath.photoid,(err)=>{
                        console.log(err)
                    });
                }                   
            }
        }else{
             fs.mkdirSync(dirpath, error => console.log(error));
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


router.put("/update",upload.any(),async(req,res)=>{
    console.log(req.body);
    var hashedPassword=  saltedCrypt.encrypt(req.body.password);

    var getDoc={_id:req.body._id};
    if(req.files.length === 1 && req.files[0].fieldname === 'photo')
    {
        var updatedValues={$set:{   fullName: req.body.fullName, 
                                    address: req.body.address, 
                                    contactNo: req.body.contactNo,
                                    department:req.body.department,
                                    designation:req.body.designation,
                                    password: hashedPassword,
                                    photo: req.files[0].path
                                }};
    }
    else if(req.files.length === 1 && req.files[0].fieldname === 'photoId'){
        var updatedValues={$set:{   fullName: req.body.fullName, 
                                    address: req.body.address, 
                                    contactNo: req.body.contactNo,
                                    department:req.body.department,
                                    designation:req.body.designation,
                                    password: hashedPassword,
                                    photoid: req.files[0].path
                                }};
    }
    else if(req.files.length === 2){
        var updatedValues={$set:{   fullName: req.body.fullName, 
                                    address: req.body.address, 
                                    contactNo: req.body.contactNo,
                                    department:req.body.department,
                                    designation:req.body.designation,
                                    password: hashedPassword,
                                    photo: req.files[0].path,
                                    photoid: req.files[1].path
                                }};
    }
    else {
        var updatedValues={$set:{   fullName: req.body.fullName, 
                                    address: req.body.address, 
                                    contactNo: req.body.contactNo,
                                    department:req.body.department,
                                    designation:req.body.designation,
                                    password: hashedPassword
                                }};
    }

    
    
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
        
        var dirName =await employee.findOne({_id:req.body._id},{'userid':1,'_id':0});
            
         fs.rm('./uploads/'+dirName.userid,{recursive:true,force:true},(err)=>{
             if(err){
                 console.log(err);
             }
         });

         await employee.deleteOne({_id:req.body._id},(err)=>{
             if(!err){
            console.log("Entry deleted Successfully!");
            }else{
                console.log(err);
            }    
        });

           await attendee.deleteOne({_id:req.body._id},(err)=>{
                if(err){
                    res.send(err);
                }else(
                    res.status(202).json({
                        message:'Entry Deleted'
                    })
                )
            });       
});

router.get("/",async(req,res)=>{
    var result = await employee.find({});
    for(var i=0;i<result.length;i++){
        var decryptedPassword=saltedCrypt.decrypt(result[i].password);
        result[i].password=decryptedPassword;
    }
    res.send(result); 
})

router.get("/attendance/:id",async(req,res)=>{
    await attendee.findById(req.params.id)
    .then(empFound => {
        if(!empFound){ return res.status(404).end()}
        return res.send(empFound)
    })
    .catch(err => console.log(err))
});


module.exports=router; 