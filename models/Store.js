const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    postal_number: {
      type: String,
      trim: true,
      match: /^[0-9]{5}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema, "Stores");
