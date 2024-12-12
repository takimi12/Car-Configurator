import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { Part, RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { OrderSubmitData, submitOrder } from "../api/hooks";

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const globalParts = useSelector((state: RootState) => state.example.parts);

  const totalPrice = globalParts.reduce(
    (sum: number, part: Part) => sum + part.price,
    0,
  );
  const orderDetails = globalParts.map((part: Part) => part.name).join(", ");

  const orderMutation = useMutation({
    mutationFn: submitOrder,
    onSuccess: () => {
      dispatch({ type: "example/setParts", payload: [] });
      alert("Zamówienie zostało złożone pomyślnie!");
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Error submitting order:", error);
      alert("Wystąpił błąd podczas składania zamówienia");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Proszę wypełnić wszystkie pola");
      return;
    }

    const orderData: OrderSubmitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      value: totalPrice,
      details: orderDetails,
    };

    orderMutation.mutate(orderData);
  };

  return (
    <Box sx={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Podsumowanie zamówienia
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: "24px",
          marginTop: "24px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: "grey.100",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Wybrane części
          </Typography>
          <List>
            {globalParts.map((part: Part) => (
              <ListItem key={part.id} disablePadding>
                <ListItemText
                  primary={part.name}
                  secondary={`${part.price.toFixed(2)} PLN`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ margin: "16px 0" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Razem:
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {totalPrice.toFixed(2)} PLN
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmitOrder}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <TextField
            label="Imię"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={orderMutation.isPending}
          />
          <TextField
            label="Nazwisko"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={orderMutation.isPending}
          />
          <TextField
            label="Adres email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={orderMutation.isPending}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: "12px", fontSize: "1rem" }}
            disabled={orderMutation.isPending}
          >
            {orderMutation.isPending
              ? "Składanie zamówienia..."
              : "Złóż zamówienie"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
