import { useNavigate } from "react-router-dom";
// eslint-disable-next-line react-refresh/only-export-components
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Branch Name",
    selector: (row) => row.name,
    sortable: true,
    width: "200px",
  },
  {
    name: "Location",
    selector: (row) => row.location,
    width: "200px",
  },
  {
    name: "latitude",
    selector: (row) => row.latitude,
    sortable: true,
    width: "130px",
  },
  {
    name: "longitude",
    selector: (row) => row.longitude,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];
export const BranchesButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Delete
      </button>
    </div>
  );
};
