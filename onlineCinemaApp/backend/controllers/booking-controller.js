import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// Updated newBooking
export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  // Validate inputs
  if (!movie || !date || !seatNumber || !user) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Check if movie and user exist
    const [existingMovie, existingUser] = await Promise.all([
      Movie.findById(movie).session(session),
      User.findById(user).session(session),
    ]);

    if (!existingMovie) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Movie not found with the given ID." });
    }

    if (!existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found with the given ID." });
    }

    // Create a new booking
    const booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    // Add booking references to user and movie
    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    // Save all entities within the transaction
    await Promise.all([
      existingUser.save({ session }),
      existingMovie.save({ session }),
      booking.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Updated getBookingById
export const getBookingById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const booking = await Bookings.findById(id).populate("user movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    console.error("Error fetching booking:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Updated deleteBooking
export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find booking and populate references
    const booking = await Bookings.findById(id)
      .populate("user")
      .populate("movie")
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Booking not found." });
    }

    // Remove references from user and movie
    await booking.user.bookings.pull(booking._id);
    await booking.movie.bookings.pull(booking._id);

    await Promise.all([
      booking.user.save({ session }),
      booking.movie.save({ session }),
      booking.deleteOne({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};