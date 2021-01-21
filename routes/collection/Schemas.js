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

const newVoucher = new Mongo.Schema({
    voucherNo:{type:Number,required:true,unique:true},
    dateOfVoucher:{type:Date,required:true},
    eventCompany:{type:String,required:true},
    venue:{type:String,required:true},
    contactPersonName:{type:String,required:true},
    contactPersonMobile:{type:Number,required:true},
    team:[{
        userid:{type:String,required:true},
        fullName:{type:String,required:true}
        } 
    ],
    vehicle:{type:String,required:true}
})

const newdailyExpense= new Mongo.Schema({
    voucherNo:{type:Number,required:true,unique:true},
    dateOfVoucher:{type:Date,required:true},
    amountPaid:{type:Number,required:true},
    paidTo:{type:String,required:true},
    paidBy:{type:String,required:true},
    remark:{type:String,required:true},
    paymentMode:{type:String,required:true},
    paymentSource:{type:String,required:false},
    photo:{type:String,required:true}
})

const Voucher= connection.model('Voucher',newVoucher);
const Employee=connection.model("Employee",empSchema);
const Attendee=connection.model("Attendee",attendee,"attendance");
const dailyExpenses=connection.model("Expense",newdailyExpense);


module.exports={
    employee: Employee, 
    attendee: Attendee,
    voucher: Voucher,
    dailyExpense: dailyExpenses
}
