import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient.js";

export default function AddLeave() {
  const [leave, setLeave] = useState({
    date: "",
    from_time: "00:00",
    till_time: "11:59",
  });
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUid(user.id);
      else {
        alert("User not authenticated.");
        navigate("/login"); // redirect if needed
      }
    };
    getUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid) {
      alert("User not authenticated.");
      return;
    }

    const { date, from_time, till_time } = leave;

    try {
      const { error } = await supabase.from("not_available").insert([
        {
          uid,
          date,
          from_time,
          till_time,
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        alert("Failed to submit unavailability.");
      } else {
        alert("Unavailability submitted!");
        setLeave({ date: "", from_time: "00:00", till_time: "11:59" });
        navigate("/dashboard"); // or wherever you want to go next
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request for Unavailability</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={leave.date}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="time"
                name="from_time"
                value={leave.from_time}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="time"
                name="till_time"
                value={leave.till_time}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Unavailability
        </button>
      </form>
    </div>
  );
}
