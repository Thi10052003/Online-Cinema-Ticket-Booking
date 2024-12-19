import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
} from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  IconButton,
  Box,
  Typography,
  Alert,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // Fetch user and bookings data concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingResponse, userResponse] = await Promise.all([
          getUserBooking(),
          getUserDetails(),
        ]);
        setBookings(bookingResponse.bookings);
        setUser(userResponse.user);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data or bookings.");
      }
    };

    fetchData();
  }, []);

  // Handle delete booking action
  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteBooking(id);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      } catch (err) {
        console.error(err);
        setError("Failed to delete the booking. Please try again.");
      }
    },
    [setBookings]
  );

  // Filter bookings based on search value
  const filteredBookings = bookings.filter((booking) =>
    booking.movie.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box width={"100%"} display="flex" flexDirection="column" padding={2} sx={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <Fragment>
        {/* Error State */}
        {error && (
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* User Details Section */}
        {user && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            mb={5}
            sx={{ border: "1px solid #ccc", borderRadius: 4, padding: 3, backgroundColor: "#000" }}
          >
            <AccountCircleIcon sx={{ fontSize: "5rem", color: "#fff" }} />
            <Typography variant="h5" fontWeight="bold" mt={1} color="white">
              {user.name}
            </Typography>
            <Typography variant="body1" color="gray">
              {user.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => console.log("Edit Profile Clicked")}
            >
              Edit Profile
            </Button>
          </Box>
        )}

        {/* Search Bar */}
        <Box display="flex" justifyContent="center" mb={3}>
          <TextField
            placeholder="Search by movie name"
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
            sx={{ maxWidth: 600, backgroundColor: "#222", color: "#fff", borderRadius: "4px" }}
            inputProps={{ style: { color: "white" } }}
          />
        </Box>

        {/* Bookings List */}
        <Box>
          <Typography
            variant="h4"
            fontFamily={"verdana"}
            textAlign="center"
            mb={3}
            color="white"
          >
            My Bookings
          </Typography>
          {filteredBookings.length > 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{ backgroundColor: "#000" }}
            >
              {filteredBookings.map((booking) => (
                <Box
                  key={booking._id}
                  display="flex"
                  alignItems="center"
                  width="100%"
                  maxWidth={800}
                  padding={2}
                  sx={{
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#111",
                  }}
                >
                  <img
                    src={booking.movie.posterUrl}
                    alt={booking.movie.title}
                    style={{
                      width: "80px",
                      height: "120px",
                      borderRadius: "4px",
                    }}
                  />
                  <Box ml={3} flexGrow={1}>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {booking.movie.title}
                    </Typography>
                    <Typography variant="body2" color="gray">
                      Seat: {booking.seatNumber}
                    </Typography>
                    <Typography variant="body2" color="gray">
                      Date: {new Date(booking.date).toLocaleString() || "Invalid Date"}
                    </Typography>
                  </Box>
                  <Tooltip title="Delete Booking">
                    <IconButton
                      onClick={() => handleDelete(booking._id)}
                      color="error"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" mt={5}>
              {/* <img
                src="/assets/no-bookings.svg"
                alt="No bookings"
                style={{ width: "200px" }}
              /> */}
              <Typography variant="h6" color="gray" mt={2}>
                You have no bookings yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/movies"
                sx={{ mt: 2 }}
              >
                Book Now
              </Button>
            </Box>
          )}
        </Box>
      </Fragment>
    </Box>
  );
};

export default UserProfile;
