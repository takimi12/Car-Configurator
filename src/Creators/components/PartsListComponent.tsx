import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Part } from "../../types/index";

interface PartsListProps {
  parts?: Part[];
  onAddPart: (part: Part) => void;
}

export const PartsList: React.FC<PartsListProps> = ({ parts, onAddPart }) => {
  const selectedParts = useSelector((state: RootState) => state.example.parts);

  const isPartSelected = (part: Part) => {
    return selectedParts.some(
      (selected) => selected._id === part._id || selected.id === part.id,
    );
  };

  return (
    <Paper elevation={3} sx={{ flex: 1, padding: "16px", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>
        Części w tej kategorii:
      </Typography>
      {parts && parts.length > 0 ? (
        <List>
          {parts.map((part) => (
            <ListItem key={part.id} disablePadding>
              <ListItemText
                primary={part.name}
                secondary={`Cena: ${part.price.toFixed(2)} PLN`}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => onAddPart(part)}
                disabled={isPartSelected(part)}
              >
                {isPartSelected(part) ? "Dodano" : "Dodaj"}
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Brak części w tej kategorii.</Typography>
      )}
    </Paper>
  );
};
