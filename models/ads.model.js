const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const adsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        originalUrl: {
          type: String,
          required: true,
        },
        thumbnailUrl: {
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    lga: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    condition: {
      type: String,
      enum: ["used", "brand_new", "refurbished"],
      required: true,
    },
    exchange: {
      type: Boolean,
      default: false,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

adsSchema.index({
  title: "text",
  description: "text",
});

adsSchema.pre("findOne", function (next) {
  this.populate("postedBy").populate("category");
  next();
});

adsSchema.plugin(mongoosePaginate);

const Ads = mongoose.model("Ads", adsSchema);

module.exports = Ads;
