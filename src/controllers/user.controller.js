import { asyncHandeler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnClodinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandeler(async (req,res) => {
    //  res.status(200).json({
    //     message: "ok"
    // })


    //get user details from frontend
    //validation - not empty
    //check if user already exist: userrname,email
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response


   const {fullName, email,username, password} =  req.body
   console.log("email:",email);

//    if (fullName === "") {
//     throw new ApiError(400, "fullname is required")
    
//    }

if (
    [fullName,email,username,password].some((field) => 
     
    field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

const existedUser = User.findOne({
    $or: [{username},{email}]
})

if (existedUser) {
    throw new ApiError(409, "user with email or username already exist")

}

const avatartLocalPath  = req.files?.avatar[0]?.path;
const coverImageLocalpath = req.files?.coverImage[0]?.path;

if (!avatartLocalPath) {
    throw new ApiError(400, "Avatar file is required")
    
}

const avatar = await uploadOnClodinary(avatartLocalPath)
const coverImage = await uploadOnClodinary(coverImageLocalpath)

if(!avatar){
    throw new ApiError(400, "Avatar file is required")

}

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refresheToken"
)

if (!createdUser) {
    throw new ApiError(500,"something went wrong while register user")
    
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)


})

export {registerUser}