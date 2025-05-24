
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView/main";
import LoginForm from "./Forms/LoginForm";
import RegistrationForm from "./Forms/RegisterForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
