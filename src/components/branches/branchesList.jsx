import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient.js";
import { BranchesButtons, columns } from "./branchHelper.jsx";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [brLoading, setBrLoading] = useState(false);
  const [filteredBranch, setFilteredBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setBrLoading(true);
      try {
        const { data, error } = await supabase
          .from("branches")
          .select("id, name, location, longitude, latitude");

        if (error) throw error;

        let sno = 1;
        const formatted = data.map((branch) => ({
          _id: branch.id,
          sno: sno++,
          name: branch.name,
          location: branch.location,
          longitude: branch.longitude,
          latitude: branch.latitude,
          action: <BranchesButtons Id={branch.id} />,
        }));

        setBranches(formatted);
        setFilteredBranch(formatted);
      } catch (error) {
        console.error(error.message);
        alert("Failed to fetch branches");
      } finally {
        setBrLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleFilter = (e) => {
    const records = branches.filter((branch) =>
      branch.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBranch(records);
  };

  if (!filteredBranch) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Branches</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Branch Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-branch"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Branch
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredBranch} pagination />
      </div>
    </div>
  );
};

export default BranchList;
