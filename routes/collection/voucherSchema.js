const mongo = require('mongoose');
const url='mongodb+srv://imuser_1:6j66NKam3Lt8uXHE@cluster0.mdzsd.mongodb.net/VoucherDB?retryWrites=true&w=majority';

const connection = mongo.createConnection(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,res)=>{
    if(err){
        console.log(err)
    }else(
        console.log('Connected to Voucher DB')
    )
});

const newVoucher = new mongo.Schema({
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

const Voucher= connection.model('Voucher',newVoucher);

module.exports={
    voucher: Voucher
}