import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import './Booking.css'; // Import CSS
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const Location = useLocation();
  const data = Location.state;
  const [movie, setMovie] = useState(data);
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState(["B3","B4", "C4", "D5","E9","E10","E11","E12"]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = useParams().id;

  const rows = ["A", "B", "C", "D", "E","F","G","H","J"];
  const seatsPerRow = 20;

  const date = "28-05-2025";

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then((res) => {
        setMovie(res.movie);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch movie details.");
        setLoading(false);
      });
  }, [id]);

  const handleSeatSelection = (seat) => {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const seatIndex = newSeats.indexOf(seat);

      if (seatIndex === -1) {
        newSeats.push(seat);
      } else {
        newSeats.splice(seatIndex, 1);
      }

      setInputs((prevInputs) => ({
        ...prevInputs,
        seatNumber: newSeats.join(", "),
      }));

      return newSeats;
    });
  };

  useEffect(() => {
    const seatCost = 50000;
    setTotalCost(selectedSeats.length * seatCost);
  }, [selectedSeats]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.seatNumber || !inputs.date) {
      setError("Please fill in all the fields.");
      return;
    }

    newBooking({ ...inputs, movie: movie._id, seats: selectedSeats })
      .then((res) => {
        console.log("Booking successful:", res);
        navigate("/payment", { state: { seats: selectedSeats, totalCost, date: inputs.date } });
      })
      .catch((err) => setError("Booking failed. Please try again."));
  };

  const handleCancel = () => {
    navigate("/movies");
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      {movie && (
        <div>
          <Typography padding={3} fontFamily="Arial" variant="h4" textAlign="center">
            BOOKING ONLINE
          </Typography>
          <Box display="flex" justifyContent="center">
            <Box width="100%" paddingTop={3}>
              <form onSubmit={handleSubmit}>
                <Box margin="auto" display="flex" flexDirection="column">
                  <Box className="seat-container">
                    <div className="screen" id="screen">
                      Screen
                    </div>
                    {rows.map((row) => (
                      <Box key={row} className="row">
                        {Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`).map((seat) => (
                          <div
                            key={seat}
                            className={`seat ${occupiedSeats.includes(seat)
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
                <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={5} padding={2} className="poster-info">
                  <Box display="flex" alignItems="center">
                    <img className="poster-image" style={{ width: "100px", height: "150px" }} src={movie.posterUrl} alt={movie.title} />
                    <Box marginLeft={2}>
                      <Typography variant="h6" fontWeight="bold">{movie.title}</Typography>
                      <Typography>Price: {totalCost} ₫</Typography>
                      <Typography variant="body1" sx={{ marginTop: "8px" }}>Selected Seats: {selectedSeats.join(", ") || "None"}</Typography>
                      <Typography variant="body1" sx={{ marginTop: "8px" }}>Date: {date}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button onClick={handleCancel} variant="contained" sx={{ height: "40px", width: "200px", backgroundColor: "red", color: "white", '&:hover': { backgroundColor: "darkred" } }}>
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
