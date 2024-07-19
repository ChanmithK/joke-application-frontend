"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  // Initialize Next.js router
  const router = useRouter();

  // State variables for form inputs and error state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to login existing user
  const login = async () => {
    try {
      // Make an HTTP request to your login API
      const response = await axios.post(
        "https://moderate-jokes-microservice-production.up.railway.app/auth/login",
        {
          email,
          password,
        }
      );

      // Assuming response contains userId and token
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Redirect to user page after login
      router.push("/pages/view-jokes");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  // JSX rendering the login form
  return (
    <section className="relative bg-gradient-to-b from-purple-800 via-pink-500 to-red-500 text-white min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="relative z-10 max-w-md w-full bg-gradient-to-r from-purple-900 via-pink-700 to-red-500 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-extrabold mb-6 drop-shadow-lg shadow-black text-center">
          Login to your account
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2 text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-3 border border-purple-900 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="name@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2 text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-purple-900 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="********"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
              onClick={login}
            >
              Login
            </button>
          </div>
          <h3 className="text-center mt-4 cursor-pointer">
            <a href="/">Back to Home -&gt; </a>
          </h3>
        </form>
      </div>
    </section>
  );
};

export default Login;
