import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function GetProfile() {
  const [user, setUser] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/user/${id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data.user);
        console.log(res.data.user._id);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if(id) fetchUser();
  }, [id]);

  if (!user)
    return (
      <div className="text-center mt-10 text-orange-700 text-lg font-semibold">
        🔱 Loading your divine presence... 🔱
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50">
      <div className="bg-gradient-to-b from-orange-300 to-yellow-200 p-6 rounded-lg shadow-lg w-96 text-center border-2 border-orange-500">
        <img
          src={user.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full border-4 border-orange-600 shadow-md"
        />
        <h2 className="text-2xl font-bold mt-4 text-orange-900 font-serif">
          {user.username}
        </h2>
        <p className="text-orange-800 italic">{user.email}</p>
        <p className="text-orange-700 font-medium mt-2">
          {user.bio || "A seeker of wisdom & light."}
        </p>
        <p className="text-sm text-orange-600 mt-2">Gender: {user.gender}</p>

        <div className="mt-4 flex justify-around text-orange-900">
          <div>
            <p className="text-lg font-bold">{user.followers?.length || 0}</p>
            <p className="text-sm">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.following?.length || 0}</p>
            <p className="text-sm">Following</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.posts?.length || 0}</p>
            <p className="text-sm">Posts</p>
          </div>
        </div>
        <Link to={`/${user._id}/EditProfile`}>
          <button className="mt-4 bg-orange-700 text-yellow-100 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-orange-800">
            ✨ Edit Profile ✨
          </button>
        </Link>
      </div>
    </div>
  );
}

export default GetProfile;
