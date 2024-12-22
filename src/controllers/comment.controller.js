import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments",
                pipeline: [
                    { $sort: { createdAt: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: parseInt(limit) }
                ]
            }
        },
        {
            $project: {
                comments:1,
                videoFile:1,
                views:1
            }
        }
    ]);

    if (!comments || comments.length === 0) throw new ApiError(400,"No comments")

    return res
    .status(200)
    .json(new ApiResponse(201,comments,"Comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body

    if(!content) throw new ApiError(400,"Please add some comment")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    if(!comment) throw new ApiError(400,"Could not post comment")

    return res
    .status(200)
    .json(new ApiResponse(201,comment,"Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    if(!content)throw new ApiError(400,"Please add some content in comment")
    
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content
            }
        },
        {new:true}
    )

    if(!updatedComment)throw new ApiError(400,"Could not update comment")

    return res
    .status(200)
    .json(new ApiResponse(201,updatedComment,"Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment) throw new ApiError(400,"Could not delete comment")

    return res
    .status(200)
    .json(new ApiResponse(201,comment,"Comment deleted Successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }