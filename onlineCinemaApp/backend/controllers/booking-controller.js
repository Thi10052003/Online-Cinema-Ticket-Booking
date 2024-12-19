import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, seatNumber, user, selectedDate, selectedShowtime } = req.body;

  if (!movie || !seatNumber || !user || !selectedDate || !selectedShowtime) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [existingMovie, existingUser] = await Promise.all([
      Movie.findById(movie).session(session),
      User.findById(user).session(session),
    ]);

    if (!existingMovie || !existingUser) {
      throw new Error("Movie or User not found.");
    }

    const seatNumbers = Array.isArray(seatNumber) ? seatNumber : [seatNumber];
    const isSeatOccupied = seatNumbers.some((seat) =>
      existingMovie.occupiedSeats?.some(
        (occupied) =>
          occupied.seat === seat &&
          occupied.date === selectedDate &&
          occupied.showtime === selectedShowtime
      )
    );

    if (isSeatOccupied) {
      throw new Error("One or more seats are already occupied.");
    }

    // Add new booking
    const booking = new Bookings({
      movie,
      seatNumber: seatNumbers,
      user,
      selectedDate,
      selectedShowtime,
    });

    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    // Update occupied seats
    seatNumbers.forEach((seat) => {
      existingMovie.occupiedSeats.push({
        seat,
        date: selectedDate,
        showtime: selectedShowtime,
      });
    });

    await Promise.all([
      booking.save({ session }),
      existingMovie.save({ session }),
      existingUser.save({ session }),
    ]);

    await session.commitTransaction();
    return res.status(201).json({ booking });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error creating booking:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  } finally {
    session.endSession();
  }
};


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

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find booking and populate references
    const booking = await Bookings.findById(id)
      .populate("user")
      .populate("movie")
      .session(session);

    if (!booking) {
      throw new Error("Booking not found.");
    }

    // Remove references from user and movie
    booking.user.bookings.pull(booking._id);
    booking.movie.bookings.pull(booking._id);

    // Remove seat(s) from occupiedSeats in the movie
    const seatNumbers = Array.isArray(booking.seatNumber)
      ? booking.seatNumber
      : [booking.seatNumber];
    booking.movie.occupiedSeats = booking.movie.occupiedSeats.filter(
      (occupied) =>
        !seatNumbers.includes(occupied.seat) ||
        occupied.date !== booking.selectedDate ||
        occupied.showtime !== booking.selectedShowtime
    );

    // Save updates and delete booking
    await Promise.all([
      booking.user.save({ session }),
      booking.movie.save({ session }),
      booking.deleteOne({ session }),
    ]);

    await session.commitTransaction();
    return res.status(200).json({ message: "Successfully deleted booking." });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error deleting booking:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  } finally {
    session.endSession();
  }
};
