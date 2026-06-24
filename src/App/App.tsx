import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router"; // yaratgan routerimizni import qilamiz

const App: React.FC = () => {
  return (
    // RouterProvider butun loyihaga marshrutlarni tarqatadi
    <RouterProvider router={router} />
  );
};

export default App;
