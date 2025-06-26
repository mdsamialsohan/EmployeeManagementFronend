import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthContext from "./context/authContext";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <AuthContext>
    <App />
  </AuthContext>
);
