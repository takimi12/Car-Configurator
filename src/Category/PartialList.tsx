import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
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
import { NewPart, Part } from "../types";
import { useGetParts } from "../hooks/useGetParts";
import { useAddPart } from "../hooks/useAddPart";
import { useDeletePart } from "../hooks/useDeletePart";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useCategoryName } from "../hooks/useCategoryName";

export const PartialList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const categoryName = useCategoryName(id);
  const { data: parts, isLoading, isError, error } = useGetParts();


  const [newPart, setNewPart] = useState<NewPart>({
    name: "",
    price: "",
    partId: "",
  });

  const addPartMutation = useAddPart(id, () =>
    setNewPart({ name: "", price: "", partId: "" }),
  );
  const deletePartMutation = useDeletePart(id);
  const deleteCategoryMutation = useDeleteCategory();

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPart.name || !newPart.price || !newPart.partId || !id) {
      alert(
        "Proszę wypełnić wszystkie pola i upewnij się, że kategoria istnieje.",
      );
      return;
    }

    const formattedPartId = newPart.partId.toLowerCase().replace(/\s+/g, "-");
    addPartMutation.mutate({
      name: newPart.name,
      price: newPart.price,
      partId: formattedPartId,
    });
  };

  const handleDeleteCategory = () => {
    if (
      window.confirm(`Czy na pewno chcesz usunąć kategorię "${categoryName}"?`)
    ) {
      deleteCategoryMutation.mutate(id!, {
        onSuccess: () => navigate("/categories"),
      });
    }
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
      {/* Lista części */}
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
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCategory}
            sx={{ mb: 2, ml: 2 }}
          >
            Usuń kategorię i części
          </Button>
        </Box>

        {parts?.length === 0 ? (
          <Typography variant="body1">Brak części w tej kategorii</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {/* {parts?.map((part: Part) => (
              <Card key={part.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6">{part.name}</Typography>
                  <Typography variant="subtitle1">
                    Cena: {part.price} PLN
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    ID części: {part.partId}
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
            ))} */}
          </Box>
        )}
      </Box>

      {/* Formularz dodawania */}
      <Box
        component="form"
        onSubmit={handleAddPart}
        sx={{
          mt: 15,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "500px",
          ml: 4,
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
          label="ID części (np. opening-roof)"
          value={newPart.partId}
          onChange={(e) =>
            setNewPart((prev) => ({ ...prev, partId: e.target.value }))
          }
          helperText="Unikalny identyfikator części"
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
        >
          {addPartMutation.isPending ? "Dodawanie..." : "Dodaj część"}
        </Button>
      </Box>
    </Box>
  );
};
