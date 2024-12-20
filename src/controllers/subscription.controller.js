import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    const existingSubs = await Subscription.findOne({subscriber:req.user,channel:channelId})

    let subscribe
    if(existingSubs){
        subscribe = await existingSubs.deleteOne()
    } else {
        subscribe = await Subscription.create({subscriber:req.user,channel:channelId})
    }

    if(!subscribe) throw new ApiError(400,"Could not toggle subscribe")

    return res
    .status(200)
    .json(new ApiResponse(201,subscribe,"Subscribe toggled succesfully"))

    
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.find({channel:channelId})
    if(!subscribers) throw new ApiError(400,"No Subscribers")

    return res
    .status(200)
    .json(new ApiResponse(201, subscribers, "Subscribers fetched successfully"))
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channels = await Subscription.find({subscriber:subscriberId})
    if(!channels) throw new ApiError(400,"No Channels Subscribed")

    return res
    .status(200)
    .json(new ApiResponse(201, channels, "Subscribed Channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
