const mongoose=require('mongoose')
const crypto=require('crypto')
const  userSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true,
            trim:true
        },
        email:
        {
            type:String,
            trim:true,
            required:true,
            unique:true,
            lowercase:true
        },
        password:
        {
            type:String,
            required:true
        },
        resetLink:
        {
            data:String,
            default:''
        }
    },
    {
        timestamps:true
    }
)

module.exports=mongoose.model('User',userSchema)