const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profileImage:{
        type:String,
    }
},{timestamps:true});

userSchema.statics.hashPassword=function(password){
    return bcrypt.hash(password,10);
}

userSchema.methods.comparePassword=function(password){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken=function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'1h'});
}

module.exports=mongoose.model('User',userSchema);