import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema= new Schema(
    {
        username:{
            type:String,
            requires:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            requires:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            requires:true,
            trim:true,
            index:true,
        },
        avater:{
            type:String,  //cloudinary url
            requires:true,
        },
        coverImage:{
            type:String, //cloudnary url
        },
        watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password:{
        type:String,
        require:[true, 'password is required']
    },
    refereshtoken:{
        type:String
    }

    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAcessToken=function(){
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fulName: this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expireIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.method.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )   
}

export const User=mongoose.model("User", userSchema)