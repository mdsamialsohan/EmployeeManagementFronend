import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Add from "./components/employee/Add";
import List from "./components/employee/List.jsx";
import View from "./components/employee/view";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Login from "./pages/Login";
import HomeRedirect from "./utils/homeRedirect.jsx";
import ProtectedRoute from "./utils/protectedRoutes.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard/employees" element={<List />}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route
            path="/admin-dashboard/employees/:id"
            element={<View />}
          ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole={["admin", "employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
