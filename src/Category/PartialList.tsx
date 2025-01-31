import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPartsByCategory,
  deletePart,
  addPart,
  fetchCategories,
} from "../api/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from "@mui/material";

export const PartialList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const [newPart, setNewPart] = useState({
    name: "",
    price: "",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoryName =
    categories?.find((category) => category.id === id)?.name || id;

  const {
    data: parts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["parts", id],
    queryFn: () => (id ? fetchPartsByCategory(id) : Promise.resolve([])),
    enabled: !!id,
  });

  const deletePartMutation = useMutation({
    mutationFn: deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts", id] });
    },
  });

  const addPartMutation = useMutation({
    mutationFn: addPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts", id] });
      setNewPart({ name: "", price: "" });
    },
  });

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPart.name || !newPart.price) {
      alert("Proszę wypełnić wszystkie pola");
      return;
    }

    if (!id) {
      alert("Błąd: Brak identyfikatora kategorii");
      return;
    }

    addPartMutation.mutate({
      name: newPart.name,
      price: parseFloat(newPart.price),
      categoryId: id,
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Błąd: {error instanceof Error ? error.message : "Wystąpił błąd"}
        </Alert>
      </Container>
    );
  }

  return (
<Box display="flex" justifyContent="center" marginTop={10}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Zobacz części w kategorii {categoryName}
          </Typography>
          <Button
            variant="text"
            onClick={() => navigate("/categories")}
            sx={{ mb: 2 }}
          >
            Powrót do kategorii
          </Button>
        </Box>

        {parts && parts.length === 0 ? (
          <Typography variant="body1">Brak części w tej kategorii</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {parts?.map((part) => (
              <Card key={part.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6">{part.name}</Typography>
                  <Typography variant="subtitle1">
                    Cena: {part.price} PLN
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deletePartMutation.mutate(part.id)}
                  >
                    Usuń
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
      <Box
        component="form"
        onSubmit={handleAddPart}
        sx={{
          mt: 15,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "500px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dodaj części w kategorii {categoryName}
        </Typography>

        <TextField
          label="Nazwa części"
          value={newPart.name}
          onChange={(e) =>
            setNewPart((prev) => ({ ...prev, name: e.target.value }))
          }
          fullWidth
          required
        />
        <TextField
          label="Cena"
          type="number"
          value={newPart.price}
          onChange={(e) =>
            setNewPart((prev) => ({ ...prev, price: e.target.value }))
          }
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={addPartMutation.isPending}
          sx={{ whiteSpace: "nowrap" }}
        >
          {addPartMutation.isPending ? "Dodawanie..." : "Dodaj część"}
        </Button>
      </Box>
    </Box>
  );
};
