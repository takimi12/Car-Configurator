import React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useOrders } from "../hooks/orders/useOrders";

export const OrdersList: React.FC = () => {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CircularProgress size={80} thickness={4} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            textAlign: "center",
            borderRadius: 2,
            maxWidth: 400,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Błąd ładowania zamówień
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {error.message}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 5,
        marginTop: 15,
        background: "linear-gradient(to right, #9acdff 0%, #002462 100%)",
        paddingBottom: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            padding: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Lista Zamówień
          </Typography>
        </Box>

        <List>
          {orders?.map((order) => {
            const { _id, firstName, lastName, email, value, details } = order;

            return (
              <ListItem
                key={_id}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    background: "white",
                  }}
                >
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon />
                        <Typography variant="h6">
                          {firstName} {lastName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon color="secondary" />
                        <Typography variant="body1" color="textSecondary">
                          {email}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccountBalanceIcon />
                        <Chip
                          label={`PLN ${value}`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mt: 2,
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      <strong>Szczegóły:</strong> {details}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
};
