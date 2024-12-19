import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// Updated newBooking with occupiedSeats logic
export const newBooking = async (req, res, next) => {
  const { movie, seatNumber, user } = req.body;

  // Validate inputs
  if (!movie || !seatNumber || !user) {
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

    // Validate seat occupancy
    const seatNumbers = Array.isArray(seatNumber) ? seatNumber : [seatNumber];
    const isSeatOccupied = seatNumbers.some((seat) =>
      existingMovie.occupiedSeats.includes(seat)
    );

    if (isSeatOccupied) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "One or more seats are already occupied." });
    }

    // Create a new booking
    const booking = new Bookings({
      movie,
      seatNumber: seatNumbers,
      user,
    });

    // Add booking references to user and movie
    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    // Update occupiedSeats in the movie
    existingMovie.occupiedSeats.push(...seatNumbers);

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

// Get booking by ID (unchanged)
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

// Updated deleteBooking with occupiedSeats logic
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

    // Remove seat(s) from occupiedSeats in the movie
    const seatNumbers = Array.isArray(booking.seatNumber)
      ? booking.seatNumber
      : [booking.seatNumber];
    booking.movie.occupiedSeats = booking.movie.occupiedSeats.filter(
      (seat) => !seatNumbers.includes(seat)
    );

    // Save updates and delete booking
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
