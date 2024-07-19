"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios"; // Import Axios

const HeroSection = () => {
  const [selectedType, setSelectedType] = useState("");
  const [joke, setJoke] = useState("");

  const fetchJoke = async () => {
    try {
      const response = await axios.get(
        `https://deliver-jokes-microservice-production.up.railway.app/jokes/random?type=${selectedType}`
      );
      setJoke(response.data.content);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Failed to fetch joke. Please try again later.");
    }
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  return (
    <section className="relative bg-gradient-to-b from-purple-800 via-pink-500 to-red-500 text-white py-10 h-[100vh] flex flex-col items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/background.jpg"
          alt="Tech Solutions Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl max-h-2xl h-[70%] w-full bg-gradient-to-r from-purple-900 via-pink-700 to-red-500 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold mb-8 drop-shadow-lg shadow-black text-center">
          Welcome to the Joke Generator
        </h1>

        {/* Type Selector */}
        <div className="mb-4">
          <label htmlFor="jokeType" className="mr-2 font-semibold text-lg">
            Select Joke Type:
          </label>
          <select
            id="jokeType"
            value={selectedType}
            onChange={handleTypeChange}
            className="px-3 py-2 border rounded-md bg-purple-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="tech">Tech</option>
            <option value="punny">Punny</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchJoke}
          className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition-colors duration-300 font-bold"
        >
          Generate Joke
        </button>

        {/* Display Joke */}
        {joke ? (
          <div className="mt-8 p-6 bg-purple-900 bg-opacity-70 rounded-md shadow-md w-full max-w-md">
            <p className="text-lg font-medium text-center">{joke}</p>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-purple-900 bg-opacity-70 rounded-md shadow-md w-full max-w-md">
            <p className="text-lg font-medium text-center">
              😢 No joke found. Please Try again.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
