import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
import Detail from "../pages/detail";

export default function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/detail/:id",
      element: <Detail />,
    },
  ]);
  return <RouterProvider router={routes} />;
}
