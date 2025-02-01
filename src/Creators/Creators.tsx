import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

import { Part, PartWithQuantity, Category } from "./components/types";
import { fetchCategories, fetchPartsByCategory } from "../api/hooks";
import { RootState, addPart, removePart } from "../redux/store";
import { PartsList } from "./components/PartsListComponent";
import { SelectedParts } from "./components/SelectedPartComponent";
import { CreatorNavigation } from "./components/Navigation";

export const Creators: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const category = categories?.find((cat) => cat.position.toString() === id);

  const {
    data: parts,
    isLoading: isPartsLoading,
    error: partsError,
  } = useQuery<Part[]>({
    queryKey: ["parts", id],
    queryFn: () =>
      category ? fetchPartsByCategory(category.id) : Promise.resolve([]),
    enabled: !!category,
  });

  const globalParts = useSelector((state: RootState) => state.example.parts);

  const consolidatedParts = React.useMemo(() => {
    const partMap = new Map<string, PartWithQuantity>();

    globalParts.forEach((part: Part) => {
      if (partMap.has(part.id)) {
        const existingPart = partMap.get(part.id)!;
        partMap.set(part.id, {
          ...existingPart,
          quantity: existingPart.quantity + 1,
        });
      } else {
        partMap.set(part.id, { ...part, quantity: 1 });
      }
    });

    return Array.from(partMap.values());
  }, [globalParts]);

  const missingCategories = React.useMemo(() => {
    if (!categories) return [];

    const categoryIdsWithParts = new Set(
      consolidatedParts.map((part) => part.categoryId),
    );

    return categories.filter(
      (category) => !categoryIdsWithParts.has(category.id),
    );
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
    (sum: number, part: PartWithQuantity) => sum + part.price * part.quantity,
    0,
  );

  const lastStep = categories
    ? Math.max(...categories.map((el) => el.position))
    : 1;

  const handleAddPart = (part: Part) => {
    dispatch(addPart(part));
  };

  const handleRemovePart = (partId: string) => {
    dispatch(removePart(partId));
  };

  if (isPartsLoading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Error: Category not found</div>;
  }

  if (partsError) {
    return <div>Error loading parts: {partsError.message}</div>;
  }

  return (
    <Box sx={{ padding: "24px", maxWidth: "1200px", margin: "50px auto" }}>
      <Typography variant="h4" gutterBottom>
        Kreator wyboru samochodu
      </Typography>

      <Box>
        <Typography variant="h6">
          Etap {id} wybór z kategorii: <b>{category.name}</b>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: "24px",
          marginTop: "24px",
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
