import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export const Header: React.FC = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        transition: "background-color 0.3s ease",
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Konfigurator samochodu
          </Link>
        </Typography>

        <Button
          color="inherit"
          component={Link}
          to="/creator"
          sx={{
            "&:hover": {
              backgroundColor: "#1976d2",
              color: "white",
            },
            fontWeight: 600,
          }}
        >
          Zacznij teraz
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/orders"
          sx={{
            "&:hover": {
              backgroundColor: "#1976d2",
              color: "white",
            },
            fontWeight: 600,
          }}
        >
          Zamówienia
        </Button>
      </Toolbar>
    </AppBar>
  );
};
