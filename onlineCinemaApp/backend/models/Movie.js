import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actors: [{ type: String, required: true }],
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false, // Default to false
    },
    bookings: [
      { type: mongoose.Types.ObjectId, ref: "Booking" }, // Reference to Booking model
    ],
    occupiedSeats: { type: [String], default: [] },
  },
  { timestamps: true } // Enable createdAt and updatedAt timestamps
);

// Add indexes for commonly queried fields
movieSchema.index({ title: 1 });
movieSchema.index({ featured: 1 });

export default mongoose.model("Movie", movieSchema);
