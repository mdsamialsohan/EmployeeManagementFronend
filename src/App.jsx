import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AddBranch from "./components/branches/addBranches";
import BranchList from "./components/branches/branchesList";
import Add from "./components/employee/Add";
import List from "./components/employee/List.jsx";
import View from "./components/employee/view";
import AddLeave from "./components/leave/Add";
import LeaveList from "./components/leave/List";
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
          <Route
            path="/admin-dashboard/branches"
            element={<BranchList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-branch"
            element={<AddBranch />}
          ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute requiredRole={["admin", "employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path="/employee-dashboard/add-leave"
            element={<AddLeave />}
          ></Route>
          <Route
            path="/employee-dashboard/leaves/:id"
            element={<LeaveList />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
