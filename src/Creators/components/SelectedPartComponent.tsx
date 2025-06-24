import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Divider,
  Box,
  Link,
} from "@mui/material";
import { PartWithQuantity, Category } from "../../types/index";

interface SelectedPartsProps {
  consolidatedParts: PartWithQuantity[];
  missingCategories: Category[];
  totalPrice: number;
  wasFullyPopulated: boolean;
  onRemovePart: (partId: string) => void;
  onOrderNavigate: () => void;
}

export const SelectedParts: React.FC<SelectedPartsProps> = ({
  consolidatedParts,
  missingCategories,
  totalPrice,
  wasFullyPopulated,
  onRemovePart,
  onOrderNavigate,
}) => {
  return (
    <Paper elevation={3} sx={{ flex: 1, padding: "16px", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>
        Dodane części:
      </Typography>

      {consolidatedParts.length > 0 ? (
        <List>
          {consolidatedParts.map((part) => (
            <ListItem key={part.id} disablePadding>
              <ListItemText
                primary={`${part.name} ${part.quantity > 1 ? `(x${part.quantity})` : ""}`}
                secondary={`${part.price.toFixed(2)} PLN${part.quantity > 1 ? ` / szt.` : ""}`}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => onRemovePart(part.id)}
              >
                Usuń
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Nie dodano żadnych części.</Typography>
      )}

      <Divider sx={{ margin: "16px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Łączna cena:
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {totalPrice.toFixed(2)} PLN
        </Typography>
      </Box>

      {missingCategories.length > 0 ? (
        <Box sx={{ marginTop: "16px", color: "grey" }}>
          <Typography>
            Aby przejść do podsumowania zamówienia, musisz dodać przynajmniej
            jedną część z poniższych kategorii:
          </Typography>
          <ul>
            {missingCategories.map((cat) => (
              <li key={cat.id}>
                {cat.name}{" "}
                {wasFullyPopulated && (
                  <Link href={`/creator/${cat.position}`} underline="hover">
                    (krok {cat.position})
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ marginTop: "16px" }}
          onClick={onOrderNavigate}
        >
          Przejdź do podsumowania zamówienia
        </Button>
      )}
    </Paper>
  );
};
