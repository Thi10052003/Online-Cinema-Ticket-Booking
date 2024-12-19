import axios from "axios";

// Fetch all movies
export const getAllMovies = async () => {
  try {
    const res = await axios.get("/movie");
    return res.data;
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw new Error("Failed to fetch movies");
  }
};

// User authentication (signup or login)
export const sendUserAuthRequest = async (data, signup) => {
  try {
    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    });
    return res.data;
  } catch (err) {
    console.error("Authentication error:", err);
    throw new Error("Authentication failed");
  }
};

// Fetch movie details by ID
export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`/movie/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching movie details:", err);
    throw new Error("Failed to fetch movie details");
  }
};

export const newBooking = async (data) => {
  try {
    console.log("Payload sent to booking API:", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      user: localStorage.getItem("userId"),
      selectedDate: data.selectedDate,
      selectedShowtime: data.selectedShowtime,
    });
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      user: localStorage.getItem("userId"),
      selectedDate: data.selectedDate,
      selectedShowtime: data.selectedShowtime,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating booking:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Booking failed");
  }
};




// Fetch user bookings
export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw new Error("Failed to fetch user bookings");
  }
};

// Delete a booking
export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
    throw new Error("Failed to delete booking");
  }
};

// Fetch user details
export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw new Error("Failed to fetch user details");
  }
};

// Add a new movie
export const addMovie = async (data) => {
  try {
    const res = await axios.post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        featured: data.featured,
        actors: data.actors,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding movie:", err);
    throw new Error("Failed to add movie");
  }
};
