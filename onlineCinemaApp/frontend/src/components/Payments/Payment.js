import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import { deleteBooking } from "../../api-helpers/api-helpers";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, movie, seats, totalCost, date } = location.state || {};

  const [ticketCode, setTicketCode] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [barcodeLink, setBarcodeLink] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Generate QR Code
  const generateQRCode = async (text) => {
    try {
      const qr = await QRCode.toDataURL(text);
      setQrLink(qr);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  // Generate Barcode
  const generateBarcode = async (text) => {
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, text, { format: "CODE128" });
      setBarcodeLink(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating Barcode:", error);
    }
  };

  useEffect(() => {
    if (bookingId) {
      generateQRCode(bookingId); // Generate QR code with bookingId
    }
  }, [bookingId]);

  const handlePayment = async () => {
    const code = generateRandomCode();
    await generateQRCode(code);
    generateBarcode(bookingId); // Replace QR code with barcode for ticket confirmation
    setTicketCode(code);
    setSuccess(true);
    console.log("Payment Successful with Code:", code);
  };

  const handleCancelPayment = async () => {
    if (!bookingId) {
      setError("Booking ID is missing. Unable to cancel the booking.");
      return;
    }

    try {
      await deleteBooking(bookingId);
      console.log("Booking canceled successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error canceling booking:", error);
      setError("Failed to cancel booking. Please try again.");
    }
  };

  const handleReturnToHomepage = () => {
    navigate("/");
  };

  const generateRandomCode = (length = 6) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return code;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        borderRadius: "10px",
      }}
    >
      {/* Success Alert */}
      <Collapse in={success}>
        <Alert
          severity="success"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSuccess(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Payment Confirmed! Download your QR Code or Barcode.
        </Alert>
      </Collapse>

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Payment Details
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          padding: "2rem",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
        }}
      >
        <Typography variant="h6">Movie: {movie || "Unknown"}</Typography>
        <Typography variant="h6">
          Selected Seats: {seats?.join(", ") || "None"}
        </Typography>
        <Typography variant="h6">Total Cost: {totalCost || "0"} ₫</Typography>
        {date && (
          <Typography variant="h6">Booking Date: {date || "Not selected"}</Typography>
        )}
        <Box mt={4}>
          {/* Conditional Rendering for QR Code or Barcode */}
          {!success && qrLink && (
            <>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Please scan QR Code to pay:
              </Typography>
              <img
                src={qrLink}
                alt="QR Code"
                style={{ width: "150px", height: "150px" }}
              />
            </>
          )}
          {success && barcodeLink && (
            <>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Your Ticket Barcode:
              </Typography>
              <img
                src={barcodeLink}
                alt="Barcode"
                style={{ width: "300px", height: "100px" }}
              />
            </>
          )}
        </Box>
        {!success && (
          <Box
            mt={4}
            display="flex"
            justifyContent="space-between"
            sx={{ gap: "1rem" }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelPayment}
              sx={{
                flex: 1,
                padding: "0.8rem",
                fontWeight: "bold",
                borderColor: "#f44336",
                backgroundColor: "red",
                color:"white",
                "&:hover": {
                  backgroundColor: "darkred",
                  color: "#fff",
                },
              }}
            >
              Cancel Payment
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              sx={{
                flex: 1,
                padding: "0.8rem",
                fontWeight: "bold",
                
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              Confirm Payment
            </Button>
          </Box>
        )}
      </Box>

      {success && (
        <Button
          variant="contained"
          onClick={handleReturnToHomepage}
          sx={{
            mt: 4,
            padding: "0.8rem 2rem",
            fontWeight: "bold",
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
          }}
        >
          Return to Homepage
        </Button>
      )}

      {ticketCode && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Ticket Code: <strong>{ticketCode}</strong>
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <FacebookShareButton url={qrLink} quote={`My Ticket Code: ${ticketCode}`}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TelegramShareButton url={qrLink} title={`My Ticket Code: ${ticketCode}`}>
              <TelegramIcon size={40} round />
            </TelegramShareButton>
            <WhatsappShareButton url={qrLink} title={`My Ticket Code: ${ticketCode}`}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
          </Stack>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Payment;
