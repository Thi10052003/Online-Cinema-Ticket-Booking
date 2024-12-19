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
  },
  { timestamps: true } // Enable createdAt and updatedAt timestamps
);

bookingSchema.index({ movie: 1, user: 1 }); // Add index for faster queries

export default mongoose.model("Booking", bookingSchema);
