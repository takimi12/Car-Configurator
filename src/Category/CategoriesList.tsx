import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchCategories, addCategory, deleteCategory } from "../api/hooks";

export interface Category {
  id: string;
  name: string;
  identifier: string;
  position: number;
}

export const CategoryList: React.FC = () => {
  const [newCategory, setNewCategory] = useState({ name: "", identifier: "" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory({ name: "", identifier: "" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategoryMutation.mutate({
      name: newCategory.name,
      identifier: newCategory.identifier,
      position: (categories?.length || 0) + 1,
    });
  };

  if (isLoading)
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

  return (
    <Box display="flex" justifyContent="space-around">
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mt: 10, mb: 3 }}>
          Lista dostępnych kategorii
        </Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          {categories
            ?.sort((a, b) => a.position - b.position)
            .map((category) => (
              <Box key={category.id} sx={{ width: "100%" }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {category.identifier}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/category/part/${category.id}`)}
                      color="primary"
                    >
                      Zobacz części
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      color="error"
                    >
                      usuń kategorię
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mt: 10, mb: 3 }}>
          Stwórz nową kategorię
        </Typography>
        <Box
          component="form"
          onSubmit={handleAddCategory}
          sx={{ mb: 4, display: "flex", gap: 2 }}
        >
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <TextField
            label="Identifier"
            variant="outlined"
            fullWidth
            value={newCategory.identifier}
            onChange={(e) =>
              setNewCategory((prev) => ({
                ...prev,
                identifier: e.target.value,
              }))
            }
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ height: "56px" }}
          >
            Dodaj
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
