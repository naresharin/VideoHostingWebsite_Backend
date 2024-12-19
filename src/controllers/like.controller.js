import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user,
  });

  let like;
  if (existingLike) {
    like = await existingLike.deleteOne();
  } else {
    like = await Like.create({ video: videoId, likedBy: req.user });
  }

  if (!like) throw new ApiError(400, "Could not like Video");

  return res
    .status(200)
    .json(new ApiResponse(201, like, "Video Like Toggled Successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user,
  });

  let like;
  if (existingLike) {
    like = await existingLike.deleteOne();
  } else {
    like = await Like.create({ comment: commentId, likedBy: req.user });
  }

  if (!like) throw new ApiError(400, "Could not toggle comment like");

  return res
    .status(200)
    .json(new ApiResponse(201, like, "Comment Like Toggled Successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user,
  });

  let like;
  if (existingLike) {
    like = await existingLike.deleteOne();
  } else {
    like = await Like.create({ tweet: tweetId, likedBy: req.user });
  }

  if (!like) throw new ApiError(400, "Could not like Tweet");

  return res
    .status(200)
    .json(new ApiResponse(201, like, "Tweet Like toggled Successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({
    likedBy: req.user,
    video: { $exists: true },
  });

  if (!likedVideos) throw new ApiError("No Videos Liked");

  return res
    .status(200)
    .json(
      new ApiResponse(201, likedVideos, "Liked Videos fetched Successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
