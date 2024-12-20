import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    
    const stats = {}
    const videos = await Video.find({owner:req.user})
    const subs = await Subscription.find({channel:req.user})

    let view=0
    if(videos){
        for (const video of videos) {
            view+=video.views
        }
    }
        
    stats.views = view
    if(subs) stats.subs = subs.length

    return res
    .status(200)
    .json(new ApiResponse(201,stats,"Stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({owner:req.user})
    if(!videos) throw new ApiError(400,"No videos by user")

    return res
    .status(200)
    .json(new ApiResponse(201,videos,"Videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
