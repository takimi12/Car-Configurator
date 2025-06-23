import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetPartsByCategory } from "../hooks/useGetPartsByCategory";

import { RootState, addPart, removePart } from "../redux/store";
import { PartsList } from "./components/PartsListComponent";
import { SelectedParts } from "./components/SelectedPartComponent";
import { CreatorNavigation } from "./components/Navigation";
import { Part, PartWithQuantity } from "../types";

export const Creators: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading: isCatLoading,
    error: catError,
  } = useGetCategories();

  console.log(categories, 'categories')
  const category = categories?.find((cat) => cat.position.toString() === id);

  const {
    data: parts = [],
    isLoading: isPartsLoading,
    error: partsError,
  } = useGetPartsByCategory(category?._id);

  const globalParts = useSelector((state: RootState) => state.example.parts);

  const consolidatedParts = useMemo<PartWithQuantity[]>(() => {
    const map = new Map<string, PartWithQuantity>();
    globalParts.forEach((p: Part) => {
      const existing = map.get(p.id);
      if (existing) {
        existing.quantity++;
      } else {
        map.set(p.id, { ...p, quantity: 1 });
      }
    });
    return Array.from(map.values());
  }, [globalParts]);

  const missingCategories = useMemo(() => {
    if (!categories) return [];
    const has = new Set(consolidatedParts.map((p) => p.categoryId));
    return categories.filter((cat) => !has.has(cat._id));
  }, [categories, consolidatedParts]);

  const [wasFullyPopulated, setWasFullyPopulated] = useState(false);
  const [hadMissingCategories, setHadMissingCategories] = useState(false);

  useEffect(() => {
    if (hadMissingCategories && missingCategories.length === 0) {
      setWasFullyPopulated(true);
    }
    if (missingCategories.length > 0) {
      setHadMissingCategories(true);
    }
  }, [missingCategories.length, hadMissingCategories]);

  const totalPrice = consolidatedParts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const lastStep = categories
    ? Math.max(...categories.map((c) => c.position))
    : 1;

  const handleAddPart = (part: Part) => dispatch(addPart(part));
  const handleRemovePart = (partId: string) => dispatch(removePart(partId));

  if (isCatLoading || isPartsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (catError) {
    return (
      <Typography color="error">
        Błąd ładowania kategorii: {(catError as Error).message}
      </Typography>
    );
  }

  if (!category) {
    return (
      <Typography color="error">
        Kategoria o etapie {id} nie została znaleziona.
      </Typography>
    );
  }

  if (partsError) {
    return (
      <Typography color="error">
        Błąd ładowania części: {(partsError as Error).message}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "40px auto" }}>
      <Typography variant="h4" gutterBottom>
        Kreator wyboru samochodu
      </Typography>
      <Typography variant="h6" gutterBottom>
        Etap {id}  wybór z kategorii: <b>{category.name}</b>
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mt: 3,
        }}
      >
        <PartsList parts={parts} onAddPart={handleAddPart} />
        <SelectedParts
          consolidatedParts={consolidatedParts}
          missingCategories={missingCategories}
          totalPrice={totalPrice}
          wasFullyPopulated={wasFullyPopulated}
          onRemovePart={handleRemovePart}
          onOrderNavigate={() => navigate("/creator/order")}
        />
      </Box>

      <CreatorNavigation
        id={id}
        categories={categories}
        consolidatedParts={consolidatedParts}
        lastStep={lastStep}
      />
    </Box>
  );
};
