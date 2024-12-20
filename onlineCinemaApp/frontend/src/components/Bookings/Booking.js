import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import './Booking.css'; // Import CSS

const Booking = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableShowtimes] = useState(["10:00", "12:30", "14:00", "18:00", "20:00", "22:30"]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const id = useParams().id;

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J"];
  const seatsPerRow = 20;

  // Fetch movie details and initialize dates
  useEffect(() => {
    getMovieDetails(id)
      .then((res) => {
        setMovie(res.movie);
        setOccupiedSeats(res.movie.occupiedSeats || []);
      })
      .catch((err) => setError("Failed to fetch movie details."));

    const generateDates = () => {
      const today = new Date();
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        dates.push({
          day: futureDate.toLocaleDateString("en-US", { weekday: "short" }),
          date: futureDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        });
      }
      setAvailableDates(dates);
    };

    generateDates();
  }, [id]);

  const handleSeatSelection = (seat) => {
    if (occupiedSeats.some((s) => s.seat === seat && s.date === selectedDate && s.showtime === selectedShowtime)) {
      return;
    }

    setSelectedSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const seatIndex = newSeats.indexOf(seat);

      if (seatIndex === -1) {
        newSeats.push(seat);
      } else {
        newSeats.splice(seatIndex, 1);
      }

      return newSeats;
    });
  };

  useEffect(() => {
    const seatCost = 50000;
    setTotalCost(selectedSeats.length * seatCost);
  }, [selectedSeats]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSeats.length || !selectedDate || !selectedShowtime) {
      setError("Please select a date, showtime, and at least one seat.");
      return;
    }

    const bookingData = {
      movie: movie._id,
      seatNumber: selectedSeats,
      selectedDate,
      selectedShowtime,
    };

    try {
      const response = await newBooking(bookingData);
      const updatedMovie = await getMovieDetails(movie._id);

      setMovie(updatedMovie.movie);
      setOccupiedSeats(updatedMovie.movie.occupiedSeats);
      navigate("/payment", {
        state: {
          bookingId: response.booking._id,
          movie: movie.title,
          seats: selectedSeats,
          totalCost,
          date: selectedDate,
          showtime: selectedShowtime,
        },
      });
    } catch (err) {
      setError(err.message || "Booking failed.");
    }
  };

  const handleCancel = () => {
    navigate("/movies");
  };

  return (
    <div>
      {movie && (
        <div>
          {/* <Typography padding={3} fontFamily="Arial" variant="h4" textAlign="center">
            BOOKING ONLINE
          </Typography> */}
          <Box display="flex" justifyContent="center">
            <Box width="100%" paddingTop={3}>
              <form onSubmit={handleSubmit}>
                <Box margin="auto" display="flex" flexDirection="column">
                  {/* Date Selection */}
                  <Typography variant="h6" textAlign="center" marginBottom={2}>
                    Select Date:
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    {availableDates.map(({ day, date }) => (
                      <Box
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        sx={{
                          padding: "15px",
                          textAlign: "center",
                          cursor: "pointer",
                          borderRadius: "10px",
                          backgroundColor: selectedDate === date ? "#ff6f61" : "#f5f5f5",
                          color: selectedDate === date ? "#fff" : "#000",
                          boxShadow: selectedDate === date ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                          transition: "all 0.3s ease-in-out",
                          width: "70px",
                        }}
                      >
                        <Typography fontSize="14px" fontWeight="bold">{day}</Typography>
                        <Typography fontSize="16px">{date.split("-")[2]}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Showtime Selection */}
                  <Typography variant="h6" textAlign="center" marginTop={4}>
                    Select Showtime:
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
                    {availableShowtimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedShowtime === time ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setSelectedShowtime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>

                  {/* Seat Selection */}
                  <Box className="seat-container" marginTop={4}>
                    <div className="screen" id="screen">Screen</div>
                    {rows.map((row) => (
                      <Box key={row} className="row">
                        {Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`).map((seat) => (
                          <div
                            key={seat}
                            className={`seat ${
                              occupiedSeats.some(
                                (s) => s.seat === seat && s.date === selectedDate && s.showtime === selectedShowtime
                              )
                                ? "occupied"
                                : selectedSeats.includes(seat)
                                ? "selected"
                                : "available"
                            }`}
                            onClick={() => handleSeatSelection(seat)}
                          >
                            {seat}
                          </div>
                        ))}
                      </Box>
                    ))}
                  <Box display="flex" justifyContent="center" gap={5} marginTop={5}>
                      <Box display="flex" alignItems="center">
                        <div style={{ width: "20px", height: "20px", backgroundColor: "#00bcd4", marginRight: "5px" }}></div>
                        <Typography>Selected Seat</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <div style={{ width: "20px", height: "20px", backgroundColor: "#ff5252", marginRight: "5px" }}></div>
                        <Typography>Occupied Seat</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <div style={{ width: "20px", height: "20px", backgroundColor: "#424242", marginRight: "5px" }}></div>
                        <Typography>Seat Available</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Booking Summary and Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={5} padding={2} className="poster-info">
                  <Box display="flex" alignItems="center">
                    <img className="poster-image" style={{ width: "100px", height: "150px" }} src={movie.posterUrl} alt={movie.title} />
                    <Box marginLeft={2}>
                      <Typography variant="h6" fontWeight="bold">{movie.title}</Typography>
                      <Typography>Price: {totalCost} ₫</Typography>
                      <Typography variant="body1" sx={{ marginTop: "8px" }}>Selected Seats: {selectedSeats.join(", ") || "None"}</Typography>
                      <Typography variant="body1" sx={{ marginTop: "8px" }}>Date: {selectedDate || "None"}</Typography>
                      <Typography variant="body1" sx={{ marginTop: "8px" }}>Showtime: {selectedShowtime || "None"}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button
                      onClick={handleCancel}
                      variant="contained"
                      sx={{
                        height: "40px",
                        width: "200px",
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": { backgroundColor: "darkred" },
                      }}
                    >
                      Cancel Booking
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ height: "40px", width: "200px" }}>
                      Book Now
                    </Button>
                  </Box>
                </Box>
              </form>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Booking;
