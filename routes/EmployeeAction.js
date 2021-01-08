const express=require("express");
const Crypt= require("cryptr");
const saltedCrypt= new Crypt("Thisisthesaltforthepassword");
const router=express.Router();
const {employee}=require("./collection/Schemas");
const {attendee}=require("./collection/Schemas");
const multer=require("multer");


// const storage=multer.diskStorage({
//     destination:(req,file,callback)=>{
        
//         fs.mkdir(path.join(dirpath,req.body.userid),err=>{});
//         callback(null,dirpath+req.body.userid);
//     },
//     filename:(req,file,callback)=>{
//         callback(null,file.originalname);
//     }
// });

const upload=multer({dest: 'uploads/'});

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
                                    attendance:""
                                    });
        empschema
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Employee Registered Successfully"})
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });

        attendanceSchema
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Attendee Added successfully"})
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
    
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