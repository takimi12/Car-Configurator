import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import { Part } from "./types";

interface PartsListProps {
  parts?: Part[];
  onAddPart: (part: Part) => void;
}

export const PartsList: React.FC<PartsListProps> = ({ parts, onAddPart }) => {
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
              >
                Dodaj
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
