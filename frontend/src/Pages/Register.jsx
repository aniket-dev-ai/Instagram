import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  async function submitForm(e) {
    e.preventDefault();
    console.log(form);
    await axios
      .post("http://localhost:4000/api/user/register", {
        email: form.email,
        password: form.password,
        username: form.username,
      })
      .then((res) => {
        console.log(res.data);
        setform({
          username: "",
          email: "",
          password: "",
        });
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-saffron via-gold to-deepred">
      <div className="bg-cream p-8 rounded-lg shadow-lg w-96 text-center border border-gold">
        <h1 className="text-deepred font-bold text-3xl font-sanskrit mb-4">
          श्री पंजीकरण
        </h1>
        <p className="text-gray-700 font-semibold mb-6">
          Create a divine connection with us!
        </p>

        <form className="space-y-4" onSubmit={submitForm}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username (अहम् नाम)"
            className="w-full px-4 py-2 border border-deepred rounded-md bg-transparent text-deepred font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (ईमेल)"
            className="w-full px-4 py-2 border border-deepred rounded-md bg-transparent text-deepred font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (गुप्तशब्द)"
            className="w-full px-4 py-2 border border-deepred rounded-md bg-transparent text-deepred font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
          />

          <button
            type="submit"
            className="w-full bg-saffron text-white py-2 rounded-md font-bold shadow-md hover:bg-deepred transition duration-300"
          >
            Sign Up (पंजीकरण करें)
          </button>
        </form>

        <p className="mt-4 text-gray-700">
          Already have an account?{" "}
          <a href="#" className="text-deepred font-semibold">
            Log In (प्रवेश)
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
