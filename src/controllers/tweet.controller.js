import { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content}  = req.body
    if(!content) throw new ApiError(400,"No content to post")

    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(400, "")

    const newTweet = await Tweet.create({
        content,
        owner:user
    })

    return res
    .status(200)
    .json( new ApiResponse(201, newTweet.content , "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(400,"User not found for Tweets")
    
    const tweets =await Tweet.find({owner:user._id})
    if(!tweets) throw new ApiError(400, "No tweets by User")
    
    return res
    .status(200)
    .json(new ApiResponse(201,tweets,"Here are your tweets"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content) throw new ApiError(400, "Content Required")

    const tweetId = req.params.tweetId
    const isValid = isValidObjectId(tweetId)
    if(!isValid) throw new ApiError("Invalid Id")

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new:true}
    )

    if(!updatedTweet)throw new ApiError(401,"Could not Update Tweet")

    return res
    .status(200)
    .json(new ApiResponse(201, updatedTweet , "Tweet Updated Successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId
    const isValid = isValidObjectId(tweetId)
    if(!isValid) throw new ApiError("Invalid Id")

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(201, deletedTweet, "Tweet deleted Successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
