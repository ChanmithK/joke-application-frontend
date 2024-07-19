"use client";
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Type {
  _id: number;
  type: string;
}

const AddJoke = () => {
  const [type, setType] = useState("general");
  const [types, setTypes] = useState<Type[]>([]);

  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:3002/types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  console.log("types", types);

  // Fetch jokes when component mounts
  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://submit-jokes-microservice-production.up.railway.app/jokes/submit",
        {
          type,
          content,
          status: "pending",
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setContent("");
        setError("");
      } else {
        throw new Error("Failed to submit joke");
      }
    } catch (error) {
      setError("Error submitting joke. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div>
      <Navbar type="user" />
      <section className="relative bg-gradient-to-b from-purple-800 via-pink-500 to-red-500 text-white py-16 h-[100vh]">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/background.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto mt-40 px-8 p-8 bg-gradient-to-r from-purple-900 via-pink-700 to-red-500 rounded-lg shadow-xl text-white ">
          <h2 className="text-4xl font-extrabold mb-6 drop-shadow-lg shadow-black text-center">
            Add a New Joke
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-semibold mb-2"
                htmlFor="type"
              >
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-purple-900 rounded-md px-3 py-2 bg-bg-white text-black focus:outline-none focus:ring focus:ring-purple-400"
              >
                {types.map((type) => (
                  <option key={type._id} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-semibold mb-2"
                htmlFor="content"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-purple-900 rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring focus:ring-purple-400"
                rows={4}
                placeholder="Enter the joke content..."
                required
              ></textarea>
            </div>
            {success && (
              <p className="text-green-400">Joke submitted successfully!</p>
            )}
            {error && <p className="text-red-400">{error}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddJoke;
