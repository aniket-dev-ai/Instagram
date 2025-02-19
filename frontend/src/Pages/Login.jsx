import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setform] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  async function submitForm(e) {
    e.preventDefault();
    console.log(form);
    await axios
      .post("http://localhost:4000/api/user/login", {
        email: form.email,
        password: form.password,
      })
      .then((res) => {
        console.log(res.data);
        console.log(res.data.user._id);
        localStorage.setItem("token", res.data.token);
        setform({
          username: "",
          email: "",
        });
        // alert(res.data.message);
        navigate(`/${res.data.user._id}/GetProfile`);
    })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-saffron via-gold to-deepred">
      <div className="bg-cream p-8 rounded-lg shadow-lg w-96 text-center border border-gold">
        <h1 className="text-deepred font-bold text-3xl font-serif mb-4">
          श्री प्रवेश
        </h1>
        <p className="text-gray-700 font-semibold mb-6">
          Welcome back to the divine space!
        </p>

        <form className="space-y-4" onSubmit={submitForm}>
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
            Log In (प्रवेश करें)
          </button>
        </form>

        <p className="mt-4 text-gray-700">
          New here?{" "}
          <Link to={"/register"} className="text-deepred font-semibold">
            Sign Up (पंजीकरण करें)
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
