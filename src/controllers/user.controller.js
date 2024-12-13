import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const registerUser = asyncHandler(async (req, res) => {

  const {fullName, email, username, password} = req.body

  if(
    [fullName,email,username,password].some((field)=>field?.trim()==="")
  ) {
    throw new ApiError(400,"All Fields are MANDATORY")
  }

  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409,"Username or Email already Taken")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  
  let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

  if(!avatarLocalPath) throw new ApiError(400,"Avatar File Required")

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar) throw new ApiError(400, "Avatar Field Required")

  
  const createdUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Successfully Created")
  )
});

export { registerUser };
