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
    <Box
      width={"100%"}
      display="flex"
      flexDirection="column"
      padding={3}
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <Fragment>
        {/* Error State */}
        {error && (
          <Box mb={3}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        {/* User Details Section */}
        {user && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={5}
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 4,
              padding: 4,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.8)",
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            <AccountCircleIcon sx={{ fontSize: "6rem", color: "#fff" }} />
            <Typography
              variant="h5"
              fontWeight="bold"
              mt={2}
              color="white"
            >
              {user.name}
            </Typography>
            <Typography variant="body1" color="gray">
              {user.email}
            </Typography>
          </Box>
        )}

        {/* Search Bar */}
        <Box display="flex" justifyContent="center" mb={3} width="100%">
          <TextField
            placeholder="Search by movie name"
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
            sx={{
              maxWidth: "600px",
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: "4px",
            }}
            inputProps={{ style: { color: "white" } }}
          />
        </Box>

        {/* Bookings List */}
        <Box width="100%">
          <Typography
            variant="h4"
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
              gap={3}
              sx={{
                width: "100%",
                maxWidth: "800px",
              }}
            >
              {filteredBookings.map((booking) => (
                <Box
                  key={booking._id}
                  display="flex"
                  alignItems="center"
                  width="100%"
                  padding={2}
                  sx={{
                    backgroundColor: "#1e1e1e",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <img
                    src={booking.movie.posterUrl}
                    alt={booking.movie.title}
                    style={{
                      width: "100px",
                      height: "150px",
                      borderRadius: "8px",
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
                      Date:{" "}
                      {new Date(booking.dates).toLocaleString() || "Invalid Date"}
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
              <Typography variant="h6" color="gray" mt={2}>
                You have no bookings yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/movies"
                sx={{
                  mt: 2,
                  "&:hover": { backgroundColor: "#303f9f" },
                }}
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
