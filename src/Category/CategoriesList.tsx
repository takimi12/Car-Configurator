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
import { useNavigate } from "react-router-dom";

import { useGetCategories } from "../hooks/useGetCategories";
import { useAddCategory } from "../hooks/useAddCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";

export const CategoryList: React.FC = () => {
  const [newCategory, setNewCategory] = useState({ name: "", identifier: "" });
  const navigate = useNavigate();

  const { data: categories, isLoading } = useGetCategories();
  const addCategoryMutation = useAddCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategoryMutation.mutate({
      name: newCategory.name,
      identifier: newCategory.identifier,
      position: (categories?.length || 0) + 1,
    });
    setNewCategory({ name: "", identifier: "" });
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
              <Box key={category._id} sx={{ width: "100%" }}>
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
                      onClick={() => navigate(`/category/part/${category._id}`)}
                      color="primary"
                    >
                      Zobacz części
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        deleteCategoryMutation.mutate(category._id)
                      }
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
