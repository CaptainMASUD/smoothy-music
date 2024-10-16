import mongoose,{Schema} from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new Schema(
    
    {
        username : {
            type : String,
            requird : true,
            unique : true,
            lowerCase : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            requird : true,
            unique : true,
            lowerCase : true,
            trim : true
        },
        fullname : {
            type : String,
            requird : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, // cloudnary url
            required : true
        },
        coverImage : {
            type : String, // cloudnary url
        },
        watchHistroy : [

            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String ,
            required : true,
            
        },
        refreshToken : {
            type : String
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    }
    
    ,{timeseries : true})


    UserSchema.pre("save", async function(next){
        if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 10)
        next()
    })

    UserSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password)
    }

    UserSchema.methods.generateAccessToken = function(){
      return  jwt.sign(
            {
                _id : this._id,
                email : this.email,
                username : this.username,
                fullname : this.fullname
                
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIREY
            }
        )
    }
    
    UserSchema.methods.generateRefreshToken = function(){
         return   jwt.sign(
                {
                    _id : this._id,
                    
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn : process.env.REFRESH_TOKEN_EXPIREY
                }
            )
    }
export const User = mongoose.model('User', UserSchema)