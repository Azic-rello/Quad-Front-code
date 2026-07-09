import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App/App";
// LoaderProvider'ni import qilamiz
import { LoaderProvider } from "./components/shared/Loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Butun dasturni o'raymiz */}
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
