import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ErrorPage from "../components/ErrorPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);
