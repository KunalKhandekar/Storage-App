import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { allRoutes } from "./routes";

const router = createBrowserRouter(allRoutes);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
