

const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { reset } = require("nodemon")


const studentSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true, "please Entter Your Name"],
    maxLength:[30, "Name cannot exceed 30 characters"],
    minLength:[4, "Name should have more than 4 characters"]
},
email:{
    type:String,
    required:[true, "please Entter Your Email"],
    unique:true,
    validate:[validator.isEmail, "Please Entter a valid Email"]
},
password:{
    type:String,
    required:[true, "please Entter Your Password"],
    minLength:[8, "password should have more than 8 characters"],
    select:false
},
avatar:{
        public_id:{
    type:String,
    required:true
        },
        url:{
            type:String,
            required:true
                }
    },

    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String, 

    resetPasswordExpire:Date,

})



// ============================= hashing password =============================
studentSchema.pre("save", async function(next){

if(!this.isModified("password")){
    next()
}

    this.password = await bcrypt.hash(this.password,10)
})

//=========================== jwt token ================================================

studentSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{

    expiresIn:process.env.JWT_EXPIRE
    })

}

//================================ compare password or dcrypting password  ========================


studentSchema.methods.comparePassword = async function (enteredPassword){

    return (await bcrypt.compare(enteredPassword, this.password))
  
}

//========================== Generating Password Reset Token ======================


studentSchema.methods.getResetPasswordToken = function () {

    // Generating Token 

const resetToken = crypto.randomBytes(20).toString("hex")

//========= Hashing and adding resetPasswordToken to studentSchema ====

this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

this.resetPasswordExpire = Date.now() + 15 *60*1000

return resetToken

}



module.exports = mongoose.model("User", studentSchema)



