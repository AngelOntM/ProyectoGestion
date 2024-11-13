const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema(
  {
    registro: {
      type: Object,
      required: true,
    },
    sourceType: {
      type: String,
      required: true,
      enum: ["Store", "Product"],
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "sourceType",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Backups" }
);

module.exports = mongoose.model("Backup", backupSchema);
