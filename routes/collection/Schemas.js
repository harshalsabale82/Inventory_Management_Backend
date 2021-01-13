const { text } = require("body-parser");
const Mongo=require("mongoose");
const url="mongodb+srv://imuser_1:6j66NKam3Lt8uXHE@cluster0.mdzsd.mongodb.net/EmployeeDB?retryWrites=true&w=majority";
//const url="mongodb://localhost:27017/InfoDB"

const connection=Mongo.createConnection(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,res)=>{
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
userid:{type:String,required:true,unique:true},
password :{type:String,required:true},
photo:{type:String,required:true},
photoid:{type:String,required:true}
});

const attendee = new Mongo.Schema({
    _id:{type:Mongo.Schema.Types.ObjectId,required:true},
    userId:{type:String,required:true},
    attendance:
        {   
            date:{type:Date,required:false},
            value:{type:Number,required:false}
        },
    present:{type:Number,required:true},
    absent:{type:Number,required:true},
    halfDay:{type:Number,required:true}
})



const Employee=connection.model("Employee",empSchema);
const Attendee=connection.model("Attendee",attendee,"attendance");


module.exports={
    employee: Employee, 
    attendee: Attendee
}
