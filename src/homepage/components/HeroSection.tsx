import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => (
  <Box
    sx={{
      backgroundImage:
        "url(https://auto-classic.com.pl/wp-content/uploads/2023/02/Impala-098-1024x683.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "white",
      textAlign: "center",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.4)",
      },
    }}
  >
    <Typography
      variant="h2"
      gutterBottom
      sx={{ zIndex: 1, fontWeight: 700, fontSize: { xs: "2rem", md: "3rem" } }}
    >
      Wybierz swój samochód marzeń
    </Typography>
    <Button
      variant="contained"
      color="secondary"
      component={Link}
      to="/creator"
      size="large"
      sx={{
        zIndex: 1,
        padding: "10px 30px",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#D32F2F",
        },
      }}
    >
      Zacznij teraz
    </Button>
  </Box>
);
