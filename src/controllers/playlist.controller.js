import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    throw new ApiError(400, "Name and Descriptio Required");

  const playlist = await Playlist.create({
    name,
    description,
    videos: [],
    owner: req.user,
  });

  if (!playlist) throw new ApiError(400, "Could not create playlist");

  return res
    .status(200)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const playlists = await Playlist.find({ owner: userId });
  if (!playlists) throw new ApiError(400, "No playlists by user");

  return res
    .status(200)
    .json(new ApiResponse(201, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(400, "Invalid Playlist ID");

  return res
    .status(200)
    .json(new ApiResponse(201, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user,
    },
    {
      $push: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist)
    throw new ApiError(
      400,
      "Playlist not found or user not authorized to modify it"
    );

  return res
    .status(200)
    .json(new ApiResponse(201, updatedPlaylist, "video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user,
    },
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist)
    throw new ApiError(
      400,
      "Playlist not found or user not authorized to make changes in it"
    );

  return res
    .status(200)
    .json(new ApiResponse(201, updatedPlaylist, "video deleted successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user,
  });
  if (!playlist) throw new ApiError(400, "Could not delete playlist");

  return res
    .status(200)
    .json(new ApiResponse(201, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!name && !description) throw new ApiError(400, "Nothing to update");

  const Fields = {};
  if (name) Fields.name = name;
  if (description) Fields.description = description;

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: Fields },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or could not be updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
