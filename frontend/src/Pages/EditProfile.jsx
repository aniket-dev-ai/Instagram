import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditProfile() {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    bio: "",
    gender: "",
    profilePicture: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/user/${id}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    id && fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (user.username) formData.append("username", user.username);
    if (user.bio) formData.append("bio", user.bio);
    if (user.gender) formData.append("gender", user.gender);
    if (file) formData.append("profilePicture", file);

    try {
      await axios.put(
        `http://localhost:4000/api/user/${id}/editProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully! 🚀");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600">Profile Picture:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
          </div>

          {user.profilePicture && (
            <img src={user.profilePicture} alt="Profile" className="w-24 h-24 mx-auto rounded-full border-4 shadow-md" />
          )}

          <div className="mb-4">
            <label className="block text-gray-600">Username:</label>
            <input type="text" name="username" value={user.username} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Bio:</label>
            <textarea name="bio" value={user.bio} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Gender:</label>
            <select name="gender" value={user.gender} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
