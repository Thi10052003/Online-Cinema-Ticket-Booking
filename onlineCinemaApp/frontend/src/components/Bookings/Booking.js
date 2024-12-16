import { Button, FormLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import './Booking.css'; // Import CSS
// import screenImg from "../../Img/5ff3a50c.webp"; // Update with the actual path to your image
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const Location = useLocation();
  const data = Location.state;
  const [movie, setMovie] = useState(data);
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState(["B3", "C4", "D5"]); // Example of occupied seats
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = useParams().id;

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      {movie && (
        <div>
          <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign="center">
            Book Tickets For Movie: {movie.title}
          </Typography>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" paddingTop={3} width="50%">
            <img className="poster-image" src={movie.posterUrl} alt={movie.title} />
              <Box width="80%" marginTop={3} padding={2}>
                <Typography paddingTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Starrer: {movie.actors.map((actor) => " " + actor + " ")}
                </Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Box>
            </Box>
            <Box width="50%" paddingTop={3}>
              <form onSubmit={handleSubmit}>
                <Box padding={5} margin="auto" display="flex" flexDirection="column">
                  <FormLabel>Seat Selection</FormLabel>
                  <Box className="seat-container">
                    {/* Add screen image */}
                    {/* <img src={screenImg} alt="screen" className="screen" /> */}
                    {rows.map((row) => (
                      <Box key={row} className="row">
                        {Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`).map((seat) => (
                          <div
                            key={seat}
                            className={`seat ${
                              occupiedSeats.includes(seat)
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
                  </Box>
                  <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Total Cost: {totalCost} ₫
                  </Typography>
                  <FormLabel>Booking Date</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    margin="normal"
                    variant="standard"
                    value={inputs.date}
                    onChange={(e) => setInputs({ ...inputs, date: e.target.value })}
                  />
                  <Button type="submit" sx={{ mt: 3 }}>
                    Book Now
                  </Button>
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