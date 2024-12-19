import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    seatNumber: {
      type: [String],
      required: true,
      validate: {
        validator: function (seats) {
          return seats.every((seat) => /^[A-J][0-9]{1,2}$/.test(seat));
        },
        message: (props) => `${props.value} contains invalid seat numbers.`,
      },
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedDate: {
      type: String,
      required: true,
      validate: {
        validator: (date) =>
          /^\d{4}-\d{2}-\d{2}$/.test(date), // Format: YYYY-MM-DD
        message: (props) => `${props.value} is not a valid date.`,
      },
    },
    selectedShowtime: {
      type: String,
      required: true,
      validate: {
        validator: (time) =>
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), // Format: HH:mm
        message: (props) => `${props.value} is not a valid time.`,
      },
    },
  },
  { timestamps: true } // Enable createdAt and updatedAt timestamps
);

// Indexing for efficient queries
bookingSchema.index({ movie: 1, user: 1 });
bookingSchema.index({ movie: 1, selectedDate: 1, selectedShowtime: 1 }); // Optimize showtime queries

export default mongoose.model("Booking", bookingSchema);
