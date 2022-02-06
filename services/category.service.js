const httpStatus = require("http-status");
const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

const createlisting = async (adsBody, images, userId) => {
  const adsData = {
    ...adsBody,
    images,
    price: parseInt(adsBody.price),
    postedBy: userId,
  };

  const category = await Category.findOne({ _id: adsBody.category });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ads category not found");
  }

  const ads = await Ads.create(adsData);
  return ads;
};

const getCategories = async () => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "listing not found");
  }
  return categories;
};

const getListingById = async (listingId) => {
  const listing = await Ads.findOne({ _id: listingId });
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ads Listing not found");
  }
  // const userListing = await Ads.find({ postedBy: listing.postedBy._id });
  return listing;
};


const updatePostById = async (postId, postBody) => {
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, postBody, {
    new: true,
  });
  return updatedPost;
};

const deletePostById = async (listingId, userId) => {
  const listing = await Ads.findOne({ _id: listingId, postedBy: userId });
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "listing not found");
  }
  await Ads.deleteOne({ _id: listingId, postedBy: userId });
};

module.exports = {
    getCategories
};
