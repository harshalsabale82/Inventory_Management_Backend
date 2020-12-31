const { text } = require("body-parser");
const Mongo=require("mongoose");
const url="mongodb+srv://imuser_1:6j66NKam3Lt8uXHE@cluster0.mdzsd.mongodb.net/InfoDB?retryWrites=true&w=majority";

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
            date:{type:Date,required:true},
            value:{type:Number,required:true}
        }
    
})

var newVoucher= new Mongo.Schema({
    voucherNo:{type:String,required:true,unique:true},
    date:{type:Date,required:true},
    eventCompany:{type:String,required:true},
    venue:{type:String,required:true},
    contactPersonName:{type:Number,required:true},
    contactPersonMobile:{type:String,required:true},
    team:{userid:{type:String,required:true}},
    vehicle:{type:String,required:true}
});

const Employee=Mongo.model("Employee",empSchema);
const Attendee=Mongo.model("Attendee",attendee,"Attendance");
const Voucher=Mongo.model("Voucher",newVoucher,"voucherDetails");

module.exports={
    employee: Employee,
    attendee: Attendee,
    voucher: Voucher
}
