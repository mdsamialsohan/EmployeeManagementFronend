import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient.js";
const Add = () => {
  const [formData, setFormData] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const getDepartments = async () => {
  //       const departments = await fetchDepartments();
  //       setDepartments(departments);
  //     };
  //     getDepartments();
  //   }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImageFile(files[0]);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //       // 1. Create new user in auth
  //       const { data: userData, error: userError } =
  //         await supabase.auth.admin.createUser({
  //           email: formData.email,
  //           password: formData.password,
  //           email_confirm: true,
  //         });

  //       if (userError) throw userError;

  //       const userId = userData.user.id;

  //       // 2. Upload image to storage (optional)
  //       let imageUrl = null;
  //       if (imageFile) {
  //         const { data: uploadData, error: uploadError } = await supabase.storage
  //           .from("avatars")
  //           .upload(`employees/${userId}`, imageFile, {
  //             cacheControl: "3600",
  //             upsert: true,
  //           });

  //         if (uploadError) throw uploadError;

  //         const { data: publicUrlData } = supabase.storage
  //           .from("avatars")
  //           .getPublicUrl(uploadData.path);

  //         imageUrl = publicUrlData.publicUrl;
  //       }

  //       // 3. Insert profile record
  //       const { error: insertError } = await supabase.from("profiles").insert([
  //         {
  //           id: userId,
  //           name: formData.name,
  //           employee_id: formData.employeeId,
  //           dob: formData.dob,
  //           gender: formData.gender,
  //           department_id: formData.department,
  //           role: formData.role,
  //           profile_image: imageUrl,
  //         },
  //       ]);

  //       if (insertError) throw insertError;

  //       navigate("/admin-dashboard/employees");
  //     } catch (error) {
  //       console.error("Error adding employee:", error.message);
  //       alert(error.message);
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token; // or get it from supabase.auth.getSession()

      // Upload image in frontend before calling the Edge Function
      let imageUrl = "";

      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`employees/${Date.now()}_${imageFile.name}`, imageFile);

        if (error) {
          console.error("Image upload error:", error.message);
          alert("Failed to upload image");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.path);

        imageUrl = publicUrlData.publicUrl;
      } else console.log("no image!");

      const response = await fetch(
        "https://hzuczrhpsgbcgwgonaia.supabase.co/functions/v1/create-employee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role,
            employee_id: formData.employeeId,
            dob: formData.dob,
            gender: formData.gender,
            department: formData.department,
            profile_image: imageUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to add employee");
        return;
      }

      navigate("/admin-dashboard/employees");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Insert Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Insert Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChange}
              placeholder="Employee ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              placeholder="DOB"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status */}

          {/* Designation */}

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              <option value="single">finance</option>
              <option value="married">Hr</option>
            </select>
          </div>

          {/* Salary */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              placeholder="Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div> */}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="******"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder="Upload Image"
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default Add;
