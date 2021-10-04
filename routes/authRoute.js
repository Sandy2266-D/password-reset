const router= require ('express').Router()

const{signup,activateAccount,forgotPassword,resetPassword}=require("../controllers/auth")


router.post('/signup',signup)
router.post('/email-actiavte',activateAccount)

router.put('/forgot-password',forgotPassword)
router.put('/resett-password',resetPassword)

module.exports=router;