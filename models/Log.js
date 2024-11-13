const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    action: {
      type: String,
      required: true,
      enum: ["POST", "GET", "PUT", "DELETE", "PATCH"],
      uppercase: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    params: {
      query: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
      path: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    geoInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema, "Logs");
