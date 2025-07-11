import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { supabase } from "../../utils/supabaseClient.js"; // Adjust path as needed

const LeaveList = () => {
  const [leaves, setLeaves] = useState(null);
  const [role, setRole] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  let sno = 1;

  // Fetch user role from profiles table
  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setRole(data.role);
    } catch (error) {
      alert("Failed to fetch user role: " + error.message);
    }
  };

  // Fetch leaves based on user role and id param
  const fetchLeaves = async () => {
    try {
      let query = supabase.from("not_available").select("*");

      if (role !== "admin") {
        // If not admin, filter by logged-in user ID
        query = query.eq("uid", user.id);
      } else if (id) {
        // If admin and id param exists, filter by that id
        query = query.eq("uid", id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeaves(data);
    } catch (error) {
      alert("Failed to fetch leaves: " + error.message);
    }
  };

  // Fetch role first, then leaves when role is ready
  useEffect(() => {
    if (user?.id) {
      fetchUserRole();
    }
  }, [user]);

  useEffect(() => {
    if (role) {
      fetchLeaves();
    }
  }, [role, id]);

  if (!leaves) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Dep Name"
          className="px-4 py-0.5 border"
        />
        {role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="px-4 py-1 bg-teal-600 rounded text-white"
          >
            Add New Leave
          </Link>
        )}
      </div>

      <table className="w-full text-sm text-left text-gray-500 mt-6">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
          <tr>
            <th className="px-6 py-3">SNO</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">From</th>
            <th className="px-6 py-3">To</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="bg-white border-b border-gray-200">
              <td className="px-6 py-3">{sno++}</td>
              <td className="px-6 py-3">{leave.date}</td>
              <td className="px-6 py-3">{leave.from_time}</td>
              <td className="px-6 py-3">{leave.till_time}</td>
              <td className="px-6 py-3">
                {leave.approved ? "Approved" : "Not Approved"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveList;
