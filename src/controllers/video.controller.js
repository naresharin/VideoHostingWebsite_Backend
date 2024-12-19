import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if(!userId) throw new ApiError(400,"No User Specified")
    
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video File and Thumbnail fields are Required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Video File and Thumbnail are Required")
    }

    const uploadedVideo = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration:videoFile.duration,
        owner:req.user,
        views:0
    })

    if(!updateVideo) throw new ApiError(400,"Video could not be Uploaded")
    
    return res
    .status(200)
    .json(new ApiResponse(201,uploadedVideo,"Video Uploaded Successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(400,"Video ID Required")
    
    const video = await Video.findById(videoId)
    if(!video)throw new ApiError(400,"could not find video")

    return res
    .status(200)
    .json(new ApiResponse(201,video.videoFile,"Video Retrieved Successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title,description } = req.body

    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath) throw new ApiError(400,"Thumbnail Required")

    const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!newThumbnail) throw new ApiError(400,"Could not upload Thumbnail")

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail:newThumbnail.url
            }
        },
        {new:true}
    )

    if(!updatedVideo)throw new ApiError(400,"Could not make changes in video")

    return res
    .status(200)
    .json(new ApiResponse(201, updatedVideo, "Video Updated Successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findByIdAndDelete(videoId)
    if(!video) throw new ApiError(400,"Could not delete video")

    return res
    .status(200)
    .json(new ApiResponse(201,video,"Video Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(400,"Could not toggle publish status")

    const toggle = video.isPublished
    video.isPublished=!toggle
    await video.save()


    return res
    .status(200)
    .json(new ApiResponse(201, video, "Publish Status Toggled"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
