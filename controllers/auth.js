const User=require('../models/userModels')
const jwt=require('jsonwebtoken')
const _=require('lodash')
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox3d710c262b664f56a5e5ec4615efa87a.mailgun.org';
const mg = mailgun({apiKey:process.env.MAILGUN_APIKEY, domain:DOMAIN});


// exports.signup=(req,res)=>{
//     console.log(req.body)
//     const{name,email,password}=req.body
//     User.findOne({email}).exec((err,user)=>
//     {
//         if(user){
//             return res.status(400).json({error:"user with this mailID already exists"})
//         }
//         let newUser=new User({name,email,password})
//         newUser.save((err,success)=>
//         {
//         if(err)
//         {
//             console.log("error in signup")
//             return res.status(400).json({error:err})
//         }
//         res.json({
//             message:"signup success"
//         })
//         })
//     })
// }

exports.signup=(req,res)=>{
    console.log(req.body)
    const{name,email,password}=req.body
    User.findOne({email}).exec((err,user)=>
    {
        if(user){
            return res.status(400).json({error:"user with this mailID already exists"})
        }

        const token=jwt.sign({name,email,password},process.env.ACC_ACTIVATE,{expiresIn:'20m'});

        const data = {
            from: 'noreply@hello.com',
            to: email,
            subject: 'Account Activation Link',
            html:`
            <h2>Please click on the given link to activate your account</h2>
            <p>${process.env.CILENT_URL}/authentication/activate/${token}</p>
            `
        };
        mg.messages().send(data, function (error, body) {
            if(error)
            {
                return res.json({error:err.message})
            }
            return res.json({message:"Email has sent,kindly Activate your account"})
            });

        
    //     let newUser=new User({name,email,password})
    //     newUser.save((err,success)=>
    //     {
    //     if(err)
    //     {
    //         console.log("error in signup")
    //         return res.status(400).json({error:err})
    //     }
    //     res.json({
    //         message:"signup success"
    //     })
    //     })
})
}

//Verify Authorization using Token 
exports.activateAccount=(req,res)=>
{
const{token}=req.body
if(token)
{
jwt.verify(token,process.env.ACC_ACTIVATE,function(err,decodeToken)
{
    if(err)
    return res.json({error:"Incorrect or expired Link"})
    const{name,email,password}=decodeToken;
    User.findOne({email}).exec((err,user)=>
    {
        if(user){
            return res.status(400).json({error:"user with this mailID already exists"})
        }
        let newUser=new User({name,email,password})
        newUser.save((err,success)=>
        {
        if(err)
        {
            console.log("error in signup while account activation",err)
            return res.status(400).json({error:"error activating account"})
        }
        res.json({
            message:"signup success"
        })
        })
    })
})
}
else
{
    return res.json({error:"Something went Wrong"})
}
}


exports.forgotPassword=(req,res)=>
{
const{email}=req.body;
User.findOne({email},(err,user)=>{
    if(err || !user){
        return res.status(400).json({error:"user with this mailID doesnot  exists"})
    }
    const token=jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20m'});

        const data = {
            from: 'noreply@hello.com',
            to: email,
            subject: 'Account Activation Link',
            html:`
            <h2>Please click on the given link to reset your account</h2>
            <p>${process.env.CILENT_URL}/resetpassword/${token}</p>
            `
        };

        return user.updateOne({resetLink:token},(err,success)=>{
        if(err || !user){
               return res.status(400).json({error:"reset password Link error"})
        }
        else{
            mg.messages().send(data, function (error, body) {
                if(error)
                {
                    return res.json({error:err.message})
                }
                return res.json({message:"Email has sent,kindly Follow the instructions"})
                });
        }
        })
})
}

exports.resetPassword=(req,res)=>
{
    const{resetLink,newPass}=req.body
    if(resetLink){
        jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY,function(error,decodeData){
        if(error)
        return res.status(401).json({error:"Incorrect token or its expired"})    
        
        User.findOne({resetLink},(err,user)=>{
            if(err || !user){
                return res.status(400).json({error:"User with this token doesnot exist"})
         }
         const obj={
             password:newPass,
             resetLink:''
         }
         user = _.extend(user,obj)
         user.save((err,result)=>{
        if(err || !user)
        {
                return res.status(400).json({error:"reset password error"})
         }
         else
         {  
        return res.json({message:"Your Password has been changed"})
         }
         }) 
         })
    })
    }
    else
    {
        return res.status(401).json({error:"Authenication Error"})
    }

}
