import React from "react";
import { HeroSection } from "./components/HeroSection";
import { CategoryList } from "./components/CategoryList";

export const HomePage: React.FC = () => (
  <div>
    <HeroSection />
    <CategoryList />
  </div>
);
