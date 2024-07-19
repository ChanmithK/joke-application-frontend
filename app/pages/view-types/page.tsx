"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";

interface Type {
  _id: string;
  type: string;
}

const ViewTypes = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [newType, setNewType] = useState({});

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await axios.get<Type[]>("http://localhost:3002/types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3002/type`,
        {
          type: newType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTypes([...types, response.data]);
      setNewType({ typeName: "" });
    } catch (error) {
      console.error("Error adding new type:", error);
    }
  };

  return (
    <div>
      <Navbar type="admin" />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mt-10 mb-6">Add New Type</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Type Name</label>
              <input
                type="text"
                name="typeName"
                onChange={(e) => setNewType(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Add Type
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-6 mt-9">Existing Types</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Type</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {types.map((type) => (
                  <tr
                    key={type._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {type._id}
                    </td>
                    <td className="py-3 px-6 text-left">{type.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTypes;
