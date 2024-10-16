import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/Users.model.js";
import uploadCloudinary from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessToeknANDrefreshToken = async (usrid) =>{
    const user = await User.findById(usrid)
    const accessToken =  user.generateAccessToken()
    const refreshToken =  user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken,refreshToken}
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((fields) => fields?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const ExistUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (ExistUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check if files exist
    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.coverImage?.[0];

    if (!avatarFile) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarLocalPath = avatarFile.path;
    const coverImageLocalPath = coverImageFile?.path;

    // Upload images to Cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadCloudinary(coverImageLocalPath) : null;

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const CreateUser = await User.findById(user._id).select("-password -refreshToken");
    if (!CreateUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, CreateUser, "User registered successfully")
    );
});

const LoginUser = asyncHandler( async (req,res)=>{
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required!");
    }

   const user =  await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist!")
    }

   const isPasswordValid =  await user.isPasswordCorrect(password)

   if(!isPasswordValid){
        throw new ApiError(404, "Invalid user password");
   }


   const {accessToken,refreshToken} = await generateAccessToeknANDrefreshToken(user._id)

   const logggedInUser =  await User.findById(user._id)
   .select("-password -refreshToken")

   const options = {
    httpOnly : true,
    secure : true
   }
   return res
   .status(200)
   .cookie("accessToken" , accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(
        200,
        {
            user : logggedInUser,accessToken,refreshToken
        },
        "User logged In successfully"
    )
   )

})

const loggedOutUser = asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true
       }
       return res
       .status(200)
       .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingrefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(!incomingrefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

   try {
    const decodedToken =  jwt.verify(
         incomingrefreshToken,
          process.env.REFRESH_TOKEN_SECRET
     )
    const user = await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401,"invalid refresh token")
    }
 
    if(incomingrefreshToken !== user.refreshToken){
     throw new ApiError(401, "refresh token is expired or used")
    }
 
    const options = {
     httpOnly : true,
     secure : true
    }
    
   const {accessToken,newRefreshToken} = await generateAccessToeknANDrefreshToken(user._id)
 
   return res
   .status(200)
   .cookie("accessToken", accessToken ,options)
   .cookie("refreshToken", newRefreshToken ,options)
   .json(
     new ApiResponse(
         200,
         {
             accessToken,refreshToken : newRefreshToken
         },
         "Access token refreshed"
     )
   )
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
   }
})
const changeCurrentUserPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave : false})
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "password changed successful"
        )
    )
})

const getCureentUser = asyncHandler(async (req,res)=>{
   return res
   .status(200)
   .json(200,re.user, "cureent user fetched successfully")
})

const updateAccountDetils = asyncHandler(async (req,res)=>{
    const {fullname, email} = req.body

    if(!fullname || !email){
        throw new ApiError(400, "all fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullname,
                email
            }
        },
        { new : true}
        
    ).select(
        "-password"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "accound detils updated successfully"
        )
    )
})

const updateUserAvatar = asyncHandler(async (req,res)=>{
   const avatarLocalPath =  req.files?.path

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is missing!")
   }

   const avatar =  await uploadCloudinary(avatarLocalPath)
   if(!avatar){
    throw new ApiError(400, "Error while Uploading on avatar")
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set : {
            avatar : avatar.url
        }
    },
    {new : true}
    )
    return res
    .status(200)
    .json(
       new ApiResponse(
           200,
           user,
           "Avatar Updated successfully"
       )
    )
})

const UpdateUserCoverImage = asyncHandler(async (req,res)=>{
    const coverLocalPath =  req.files?.path
 
    if(!coverLocalPath){
     throw new ApiError(400, "Avatar file is missing!")
    }
 
    const coverImage =  await uploadCloudinary(coverLocalPath)
    if(!coverImage){
     throw new ApiError(400, "Error while Uploading on cover Image")
    }
 
   const user =  await User.findByIdAndUpdate(
     req.user?._id,
     {
         $set : {
            coverImage : coverImage.url
         }
     },
     {new : true}
     )

     return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            user,
            "coverImage Updated successfully"
        )
     )
 })



export { 
    registerUser,
    LoginUser,
    loggedOutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCureentUser,
    updateAccountDetils,
    updateUserAvatar,
    UpdateUserCoverImage,
};
