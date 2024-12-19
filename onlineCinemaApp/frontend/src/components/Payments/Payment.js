import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Alert,
  IconButton,
  Collapse,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode";
import "./Payment.css";

import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";

const Payment = () => {
  const location = useLocation();
  const { seats, totalCost, movie } = location.state || {};

  const [ticketCode, setTicketCode] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  const generateRandomCode = (length = 6) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setTicketCode(code);
    return code;
  };

  const generateQRCode = async (code) => {
    const link = await QRCode.toDataURL(code);
    setQrLink(link);
  };

  const handlePayment = async () => {
    const code = generateRandomCode();
    await generateQRCode(code);

    setOpenAlert(true);
    console.log("Payment Successful with Code:", code);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <Collapse in={openAlert}>
        <Alert
          severity="success"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpenAlert(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Payment Successful! Download your QR Code or Share it.
        </Alert>
      </Collapse>

      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      {movie?.title ? (
        <>
          <Typography variant="h6">Movie: {movie.title}</Typography>
          <Typography variant="h6">Selected Seats: {seats?.join(", ")}</Typography>
          <Typography variant="h6">Total Cost: {totalCost} ₫</Typography>
        </>
      ) : (
        <Typography variant="h6" color="error">
          No movie details available
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handlePayment}
        disabled={openAlert}
      >
        {openAlert ? "Payment Completed" : "Pay Now"}
      </Button>

      {ticketCode && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6">
            Your Ticket Code: <strong>{ticketCode}</strong>
          </Typography>
          <img
            src={qrLink}
            alt="QR Code"
            style={{ width: "150px", height: "150px", margin: "10px" }}
          />
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
    </Box>
  );
};

export default Payment;
