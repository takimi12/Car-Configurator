import React from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  AcUnit as AcUnitIcon,
  Movie as MovieIcon,
  DirectionsBike as WheelsIcon,
  Build as ToolsIcon,
} from "@mui/icons-material";
import { useGetCategories } from "../../hooks/useGetCategories";
import { Category } from "../../types";

const iconMap: Record<string, React.ReactElement> = {
  dach: <HomeIcon />,
  koła: <WheelsIcon />,
  klimatyzacja: <AcUnitIcon />,
  multimedia: <MovieIcon />,
  Akcesoria: <ToolsIcon />,
};

export const CategoryList: React.FC = () => {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Loading categories...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Zobacz dostępne kategorie
      </Typography>

      <Stack
        spacing={3}
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
      >
        {categories?.map((category: Category) => (
          <Card
            key={category.id}
            sx={{
              width: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              margin: 1,
            }}
          >
            <CardContent>
              {iconMap[category.identifier]}
              <Typography variant="h6" align="center" sx={{ marginTop: 1 }}>
                {category.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                to={`/category/part/${category.id}`}
                fullWidth
              >
                Konfiguracja
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};
