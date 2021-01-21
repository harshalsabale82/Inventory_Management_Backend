const express=require("express");
const Crypt= require("cryptr");
const saltedCrypt= new Crypt("Thisisthesaltforthepassword");
const router=express.Router();
const {employee}=require("./collection/Schemas");
const {attendee}=require("./collection/Schemas");
const multer=require("multer");
const path=require("path");
const fs=require("fs");

var errormsg="UserId already exists";

const storage=multer.diskStorage({
    destination:async(req,file,callback)=>{
            
        var dirpath= "./uploads/photoAndPhotoid/"+req.body.userid;
        
        if(fs.existsSync(dirpath)===true){
            console.log("this is put request")
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

            callback(null,dirpath);

        }else{

            if(fs.existsSync(dirpath)){
                throw errormsg
            }else{
             fs.mkdirSync(dirpath, error =>{});
              callback(null,dirpath) 
            }
            
        }

    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});

const upload=multer({storage});

// make resgistration of the employee
router.post("/registration",upload.any(),async (req,res,next)=>{
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

    try {
        var empResult= await empschema.save()
       if(empResult!=null){
            var attendeeResult= await attendanceSchema.save()
                if(attendeeResult!=null){
                    res.json({"Message":"Entry Created Successfully!"});
                }else{
                    res.json({"Error":"Error has occurred"});
                }    
       } 
    } catch (error) {
 
        res.json({"errorMessage":errormsg})
    }
        
});


router.put("/update",upload.any(),async(req,res)=>{
try {
    
} catch (error) {
    
}
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
        var result= await employee.updateOne(getDoc,updatedValues)
        if(result!=null){
            res.json({"Message":"Entry updated successfully"})
        }else{
            res.json({"error":"Failed to update entry"})
        }
    } catch (error) {
        res.json({"error":error});
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
        if(Object.keys(req.body).length == obj.length){
            res.json({"Message": "Attendance marked successfully!"});
        }else{
            res.json({"error":"unable to mark attendance"});
        }
}catch(error){
    res.json({"error":error});
}
});

router.delete("/delete/:id",async(req,res)=>{

     try {
        var dirName =await employee.findById(req.params.id,{'userid':1,'_id':0});
            
        fs.rm('./uploads/'+dirName.userid,{recursive:true,force:true},(err)=>{
            if(err){
                console.log(err);
            }
        });

       var empResult= await employee.findByIdAndDelete(req.params.id)
       var attendeeResult= await attendee.findByIdAndDelete(req.params.id);

       if(empResult!==null && attendeeResult !==null){
        res.json({"Message":"Entry Deleted Successfully"});
       }

     } catch (error) {
         res.json({"Error":error});
     }         
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

router.get("/department",async(req,res)=>{
    var result = await employee.find().distinct('department',(err)=>{console.log(err)});
    res.send(result);
})

module.exports=router; 