const { text } = require("body-parser");
const Mongo=require("mongoose");
const url="mongodb://localhost:27017/InfoDB";


Mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,res)=>{
    if(err) throw err;
    else{
        console.log("Connected to database");
    }
});

const empSchema=new Mongo.Schema({
dateofjoining:{type:Date,required:true},
fullName:{type:String,required:true},
address:{type:String,required:true},
contactno:{type:Number,required:true},
department:{type:String,required:true},
designation:{type:String,required:true},
userid:{type:String,required:true},
password :{type:String,required:true},
photo:{type:String,required:true},
photoid:{type:String,required:true}
});

const attendee = new Mongo.Schema({
    _id:{type:Mongo.Schema.Types.ObjectId,required:true},
    fullName:{type:String,required:true},
    userId:{type:String,required:true},
    attendance:
        {   
            date:{type:Date,required:true},
            value:{type:Number,required:true}
        }
    
})

const Employee=Mongo.model("Employee",empSchema);
const Attendee=Mongo.model("Attendee",attendee,"Attendance");

module.exports={
    employee: Employee,
    attendee: Attendee,
}
