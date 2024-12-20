import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    actors: [{ type: String, required: true }],
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
    occupiedSeats: [
      {
        seat: { type: String },
        date: { type: String},
        showtime: { type: String},
      },
    ],
  },
  { timestamps: true }
);

// Indexing for performance
movieSchema.index({ title: 1 });
movieSchema.index({ "occupiedSeats.date": 1, "occupiedSeats.showtime": 1 });

export default mongoose.model("Movie", movieSchema);
