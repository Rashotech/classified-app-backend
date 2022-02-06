const httpStatus = require("http-status");
const Ads = require("../models/ads.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
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

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page-1) * limit : 0;

  return { limit, offset };
};

const getListings = async (page, size, keyword='', lga='', minprice='', maxprice='',  category='', region='') => {
  const { limit, offset } = getPagination(page, size);
  let query = {};
  let options = {
    sort: { createdAt: -1 },
    offset,
    limit,
  };

  if(keyword && keyword!=='false') {
    query.$text = { $search: keyword }
  }

  if(lga && lga!=='false') {
    query.lga = lga
  }

  if(region && region!=='false') {
    query.region = region
  }

  if(category && category!=='false') {
    query.category = category
  }

  if((minprice || maxprice) && (minprice || maxprice)!=='false') {
    query.price = {$gte : minprice || 0, $lte : maxprice || 1000000000};
  }

  const listings = await Ads.paginate(query, options);
  if (!listings || listings.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "listing not found");
  }
  
  return {
    totalItems: listings.totalDocs,
    data: listings.docs,
    totalPages: listings.totalPages,
    currentPage: listings.page
  };
};

const getListingById = async (listingId) => {
  const listing = await Ads.findOne({ _id: listingId });
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ads Listing not found");
  }
  // const userListing = await Ads.find({ postedBy: listing.postedBy._id });
  return listing;
};

const getListingsByCategory = async (categoryId) => {
  const listings = await Ads.find({ category: categoryId }).populate(['category', 'postedBy']);
  if (!listings) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ads Listings not found");
  }
  return listings;
};

const getListingsByUser = async (userId) => {
  const listings = await Ads.find({ postedBy: userId });
  if (!listings) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ads Listings not found");
  }
  return listings;
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
  createlisting,
  getListings,
  getListingById,
  getListingsByCategory,
  getListingsByUser,
  deletePostById
};
