import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "Arin SBke Papa hai",
  });
});

export { registerUser };
