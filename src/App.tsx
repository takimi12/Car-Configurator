import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { CategoryList } from "./Category/CategoriesList";
import { PartialList } from "./Category/PartialList";
import { Creator } from "./Creator/Creator";
import { Creators } from "./Creators/Creators";
import { OrderForm } from "./Creator/OrderForm";
import { OrdersList } from "./Order/Orders";
import { HomePage } from "./homepage/HomePage";
import { Header } from "./homepage/components/Header";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Header />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/category/part/:id" element={<PartialList />} />
              <Route path="/creator" element={<Creator />} />
              <Route path="/creator/:id" element={<Creators />} />
              <Route path="/creator/order" element={<OrderForm />} />
              <Route path="/orders" element={<OrdersList />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
