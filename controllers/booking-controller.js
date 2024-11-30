import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, user, seatNumber, date } = req.body;

  // Validate request fields
  if (!movie || !user || !seatNumber || !date) {
    return res.status(400).json({ message: "Missing required fields: movie, user, seatNumber, or date." });
  }

  let existingMovie, existingUser, session;
  try {
    // Fetch movie and user from the database
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
    
    // Log the results to debug
    console.log("Existing Movie:", existingMovie);
    console.log("Existing User:", existingUser);
  } catch (err) {
    return res.status(500).json({ message: "Error while fetching movie or user.", error: err.message });
  }

  // If the movie or user is not found, handle it gracefully
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found with the given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with the given ID" });
  }

  // Check if the user has the 'bookings' field, and initialize it if necessary
  if (!Array.isArray(existingUser.bookings)) {
    existingUser.bookings = []; // Initialize bookings as an empty array
  }

  // Check if the movie has the 'bookings' field, and initialize it if necessary
  if (!Array.isArray(existingMovie.bookings)) {
    existingMovie.bookings = []; // Initialize bookings as an empty array
  }

  let booking;
  try {
    // Create a new booking object
    booking = new Bookings({
      movie,
      date: new Date(date), // Convert the date string to a Date object
      seatNumber,
      user,
    });

    // Start a database session for atomic operations
    session = await mongoose.startSession();
    session.startTransaction();

    // Add the booking to both the user and the movie documents
    existingUser.bookings.push(booking); // Ensure existingUser is valid
    existingMovie.bookings.push(booking); // Ensure existingMovie is valid

    // Save the documents
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession(); // Always end the session after commit

  } catch (err) {
    // In case of an error, abort the transaction if session exists
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({ message: "Unable to create a booking", error: err.message });
  }

  // If booking was successfully created, return the response
  return res.status(201).json({
    message: "Booking created successfully",
    booking,
    movieTitle: existingMovie.title,
    userName: existingUser.name,
  });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user movie");
    console.log(booking);
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};