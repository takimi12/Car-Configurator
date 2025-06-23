import React from "react";
import { useGetCategories } from "../hooks/useGetCategories";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { CategoryList } from "../Category/CategoriesList";

export const Creator: React.FC = () => {
  const { isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ marginTop: 15 }}>
        <Typography variant="h4" gutterBottom align="center">
          Kreator konfiguracji samochodu
        </Typography>

        <Typography variant="h6" gutterBottom align="center">
          Skonfiguruj swój samochód wybierając co najmniej jeden element z
          dostępnych poniżej kategorii
        </Typography>

        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          color="textSecondary"
        >
          Musisz wybrać co najmniej jedną część z każdej kategorii
        </Typography>

        <Box sx={{ textAlign: "center", marginTop: 2, marginBottom: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/creator/1"
          >
            Rozpocznij konfigurację, klikając w ten przycisk
          </Button>
        </Box>
      </Container>

      <CategoryList />
    </>
  );
};
