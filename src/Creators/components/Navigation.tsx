import React from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Category, PartWithQuantity } from "./types";

interface NavigationProps {
  id?: string;
  categories?: Category[];
  consolidatedParts: PartWithQuantity[];
  lastStep: number;
}

export const CreatorNavigation: React.FC<NavigationProps> = ({
  id,
  categories,
  consolidatedParts,
  lastStep,
}) => {
  const navigate = useNavigate();

  const hasPartsForCategory = (categoryId: string) => {
    return (
      consolidatedParts.filter(
        (part: PartWithQuantity) => part.categoryId === categoryId,
      ).length > 0
    );
  };

  const handleGoBack = () => {
    if (id && parseInt(id) > 1) {
      navigate(`/creator/${parseInt(id) - 1}`);
    }
  };

  const handleGoForward = () => {
    if (id) {
      const currentCategoryParts = consolidatedParts.filter(
        (part: PartWithQuantity) => part.categoryId === id,
      );

      if (parseInt(id) === lastStep && currentCategoryParts.length > 0) {
        navigate("/creator/order");
        return;
      }

      if (currentCategoryParts.length > 0) {
        navigate(`/creator/${parseInt(id) + 1}`);
      } else {
        alert(
          "Musisz wybrać przynajmniej jedną część z tej kategorii, aby przejść dalej.",
        );
      }
    }
  };

  return (
    <Box
      sx={{
        marginTop: "24px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={handleGoBack}
        disabled={parseInt(id || "1") <= 1}
      >
        Wstecz
      </Button>

      <Box>
        {categories?.map((el) => (
          <Button
            key={el.id}
            variant="outlined"
            color="primary"
            sx={{ marginLeft: "8px" }}
            onClick={() => {
              if (
                el.position > 1 &&
                !hasPartsForCategory((el.position - 1).toString())
              ) {
                alert(
                  `Musisz wybrać przynajmniej jedną część z poprzedniej kategorii, aby przejść do etapu ${el.position}.`,
                );
                return;
              }
              navigate(`/creator/${el.position}`);
            }}
            disabled={
              el.position > 1 &&
              !hasPartsForCategory((el.position - 1).toString())
            }
          >
            {el.position}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGoForward}
        disabled={
          parseInt(id || "1") >= lastStep ||
          (id === "1" &&
            consolidatedParts.filter(
              (part: PartWithQuantity) => part.categoryId === "1",
            ).length === 0)
        }
      >
        Dalej
      </Button>
    </Box>
  );
};
