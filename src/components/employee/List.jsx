import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient.js";
import { columns, EmployeeButtons } from "./EmployeeHelper.jsx";

const List = () => {
  const [employees, setEmployees] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        // Select all users with role 'employee'
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, dob, profile_image, department, role");

        if (error) throw error;

        let sno = 1;
        const formatted = data.map((emp) => ({
          _id: emp.id,
          sno: sno++,
          dep_name: emp.department || "N/A",
          name: emp.name,
          dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
          profileImage: (
            <img
              width={40}
              className="rounded-full"
              src={emp.profile_image || "/fallback.jpg"}
              alt={emp.name}
            />
          ),
          action: <EmployeeButtons Id={emp.id} />,
        }));

        setEmployees(formatted);
        setFilteredEmployees(formatted);
      } catch (error) {
        console.error(error.message);
        alert("Failed to fetch employees");
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(records);
  };

  if (!filteredEmployee) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Seach By Dep Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Employee
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredEmployee} pagination />
      </div>
    </div>
  );
};

export default List;
