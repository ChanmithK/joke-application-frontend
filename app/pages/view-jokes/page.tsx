// "use client";
// import Navbar from "@/app/components/Navbar";
// import axios from "axios";
// import React, { useState, useEffect } from "react";

// interface Joke {
//   _id: number;
//   type: string;
//   content: string;
//   status: string;
// }

// interface Type {
//   _id: number;
//   type: string;
// }

// const ViewJokes = () => {
//   // State hooks for managing jokes and edit mode
//   const [jokes, setJokes] = useState<Joke[]>([]);
//   const [types, setTypes] = useState<Type[]>([]);
//   const [editJokeId, setEditJokeId] = useState<number | null>(null);
//   const [editType, setEditType] = useState<string>("");
//   const [editContent, setEditContent] = useState<string>("");
//   const [editStatus, setEditStatus] = useState<string>("");

//   // Function to fetch jokes from the backend
//   const fetchJokes = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "https://moderate-jokes-microservice-production.up.railway.app/jokes",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data: Joke[] = response.data;
//       setJokes(data); // Update state with fetched jokes
//     } catch (error) {
//       console.error("Error fetching jokes:", error);
//     }
//   };

//   // Function to fetch types from the backend
//   const fetchTypes = async () => {
//     try {
//       const response = await axios.get(
//         "https://moderate-jokes-microservice-production.up.railway.app/types",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setTypes(response.data);
//     } catch (error) {
//       console.error("Error fetching types:", error);
//     }
//   };

//   // Fetch jokes when component mounts
//   useEffect(() => {
//     fetchJokes();
//     fetchTypes();
//   }, []);

//   // Function to handle edit button click
//   const handleEdit = (id: number) => {
//     const jokeToEdit = jokes.find((joke) => joke._id === id);
//     if (jokeToEdit) {
//       setEditJokeId(jokeToEdit._id);
//       setEditType(jokeToEdit.type);
//       setEditContent(jokeToEdit.content);
//       setEditStatus(jokeToEdit.status);
//     }
//   };

//   // Function to handle save changes after editing
//   const handleSaveChanges = async (id: number) => {
//     if (editJokeId === null) return;

//     try {
//       const updatedJoke = {
//         id: editJokeId,
//         type: editType,
//         content: editContent,
//         status: editStatus,
//       };

//       const response = await axios.put(
//         `https://moderate-jokes-microservice-production.up.railway.app/jokes/${editJokeId}`,
//         updatedJoke,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         fetchJokes();
//         if (editJokeId === id) {
//           setEditJokeId(null);
//           setEditType("");
//           setEditContent("");
//           setEditStatus("");
//         }
//       } else {
//         throw new Error("Failed to update joke");
//       }
//     } catch (error) {
//       console.error("Error updating joke:", error);
//     }
//   };

//   // Function to update joke status in MongoDB
//   const updateJokeStatus = async (id: number, newStatus: string) => {
//     try {
//       const response = await axios.put(
//         `https://moderate-jokes-microservice-production.up.railway.app/jokes/${id}`,
//         { status: newStatus },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         fetchJokes();
//       } else {
//         throw new Error("Failed to update joke status");
//       }
//     } catch (error) {
//       console.error("Error updating joke status:", error);
//     }
//   };

//   // Function to handle add to DB button click
//   const handleAddToDB = async (data: any) => {
//     try {
//       const jokeData = {
//         type: data.type,
//         content: data.content,
//         status: "approved",
//         jokeId: data._id,
//       };
//       const response = await axios.post(
//         `https://moderate-jokes-microservice-production.up.railway.app/deliver-joke`,
//         jokeData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         await updateJokeStatus(data._id, "approved");
//       } else {
//         throw new Error("Failed to add joke to MySQL");
//       }
//     } catch (error) {
//       console.error("Error adding joke to MySQL:", error);
//     }
//   };

//   // Function to handle delete from DB button click
//   const handleDeleteFromSQLDB = async (id: number) => {
//     try {
//       const response = await axios.delete(
//         `https://moderate-jokes-microservice-production.up.railway.app/delete-joke`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           data: {
//             jokeId: id,
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log("Joke deleted from MySQL");
//       } else {
//         throw new Error("Failed to delete joke");
//       }
//     } catch (error) {
//       console.error("Error deleting joke:", error);
//     }
//   };

//   // Function to handle delete button click
//   const handleDelete = async (id: number) => {
//     try {
//       const response = await axios.delete(
//         `https://moderate-jokes-microservice-production.up.railway.app/jokes/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         handleDeleteFromSQLDB(id);
//         const updatedJokes = jokes.filter((joke) => joke._id !== id);
//         setJokes(updatedJokes);
//         if (editJokeId === id) {
//           // Clear edit mode if the deleted joke was being edited
//           setEditJokeId(null);
//           setEditType("");
//           setEditContent("");
//           setEditStatus("");
//         }
//       } else {
//         throw new Error("Failed to delete joke");
//       }
//     } catch (error) {
//       console.error("Error deleting joke:", error);
//     }
//   };

//   // Render loading spinner if jokes are being fetched
//   if (jokes.length === 0) {
//     return (
//       <div>
//         <Navbar type="user" />
//         <div className="flex items-center justify-center h-screen">
//           <svg
//             aria-hidden="true"
//             className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
//             viewBox="0 0 100 101"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//               fill="currentColor"
//             />
//             <path
//               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//               fill="currentFill"
//             />
//           </svg>
//           <span className="sr-only">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // Render jokes list once jokes are fetched
//   return (
//     <div>
//       <Navbar type="admin" />

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">Manage Jokes</h1>

//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg ">
//             <thead className="bg-gray-200 dark:bg-gray-800">
//               <tr className="text-gray-600 dark:text-gray-400 uppercase text-sm leading-normal">
//                 <th className="py-3 px-6 text-left">ID</th>
//                 <th className="py-3 px-6 text-left">Type</th>
//                 <th className="py-3 px-6 text-left">Content</th>
//                 <th className="py-3 px-6 text-left">Status</th>
//                 <th className="py-3 px-6 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 dark:text-gray-800 text-sm font-light ">
//               {jokes.map((joke) => (
//                 <tr
//                   key={joke._id}
//                   className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200"
//                 >
//                   <td className="py-3 px-6 text-left whitespace-nowrap">
//                     {joke._id}
//                   </td>
//                   <td className="py-3 px-6 text-left">
//                     {joke._id === editJokeId ? (
//                       <select
//                         value={editType}
//                         onChange={(e) => setEditType(e.target.value)}
//                         className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
//                       >
//                         {types.map((type) => (
//                           <option key={type._id} value={type.type}>
//                             {type.type}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       joke.type
//                     )}
//                   </td>
//                   <td className="py-3 px-6 text-left">
//                     {joke._id === editJokeId ? (
//                       <input
//                         type="text"
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
//                       />
//                     ) : (
//                       joke.content
//                     )}
//                   </td>
//                   <td className="py-3 px-6 text-left">{joke.status}</td>
//                   <td className="py-3 px-6 text-left">
//                     {joke._id === editJokeId ? (
//                       <div className="flex items-center gap-4">
//                         <button
//                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
//                           onClick={() => handleSaveChanges(joke._id)}
//                         >
//                           Save
//                         </button>
//                         <button
//                           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md"
//                           onClick={() => setEditJokeId(null)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-4">
//                         <button
//                           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
//                           onClick={() => handleEdit(joke._id)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
//                           onClick={() => handleDelete(joke._id)}
//                         >
//                           Delete
//                         </button>
//                         {joke.status === "approved" ? (
//                           <button className=" bg-green-300 hover:bg-green-300 text-white px-4 py-1 rounded-md ">
//                             Add to DB
//                           </button>
//                         ) : (
//                           <button
//                             className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
//                             onClick={() => handleAddToDB(joke)}
//                           >
//                             Add to DB
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewJokes;

"use client";
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface Joke {
  _id: number;
  type: string;
  content: string;
  status: string;
}

interface Type {
  _id: number;
  type: string;
}

const ViewJokes = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [editJokeId, setEditJokeId] = useState<number | null>(null);
  const [editType, setEditType] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");

  const fetchJokes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://moderate-jokes-microservice-production.up.railway.app/jokes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Joke[] = response.data;
      setJokes(data);
    } catch (error) {
      console.error("Error fetching jokes:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(
        "https://moderate-jokes-microservice-production.up.railway.app/types",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  useEffect(() => {
    fetchJokes();
    fetchTypes();
  }, []);

  const handleEdit = (id: number) => {
    const jokeToEdit = jokes.find((joke) => joke._id === id);
    if (jokeToEdit) {
      setEditJokeId(jokeToEdit._id);
      setEditType(jokeToEdit.type);
      setEditContent(jokeToEdit.content);
      setEditStatus(jokeToEdit.status);
    }
  };

  const handleSaveChanges = async (id: number) => {
    if (editJokeId === null) return;

    try {
      const updatedJoke = {
        id: editJokeId,
        type: editType,
        content: editContent,
        status: editStatus,
      };

      const response = await axios.put(
        `https://moderate-jokes-microservice-production.up.railway.app/jokes/${editJokeId}`,
        updatedJoke,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        fetchJokes();
        if (editJokeId === id) {
          setEditJokeId(null);
          setEditType("");
          setEditContent("");
          setEditStatus("");
        }
      } else {
        throw new Error("Failed to update joke");
      }
    } catch (error) {
      console.error("Error updating joke:", error);
    }
  };

  const updateJokeStatus = async (id: number, newStatus: string) => {
    try {
      const response = await axios.put(
        `https://moderate-jokes-microservice-production.up.railway.app/jokes/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        fetchJokes();
      } else {
        throw new Error("Failed to update joke status");
      }
    } catch (error) {
      console.error("Error updating joke status:", error);
    }
  };

  const handleAddToDB = async (data: any) => {
    try {
      const jokeData = {
        type: data.type,
        content: data.content,
        status: "approved",
        jokeId: data._id,
      };
      const response = await axios.post(
        `https://moderate-jokes-microservice-production.up.railway.app/deliver-joke`,
        jokeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        await updateJokeStatus(data._id, "approved");
      } else {
        throw new Error("Failed to add joke to MySQL");
      }
    } catch (error) {
      console.error("Error adding joke to MySQL:", error);
    }
  };

  const handleDeleteFromSQLDB = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://moderate-jokes-microservice-production.up.railway.app/delete-joke`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            jokeId: id,
          },
        }
      );

      if (response.status === 200) {
        console.log("Joke deleted from MySQL");
      } else {
        throw new Error("Failed to delete joke");
      }
    } catch (error) {
      console.error("Error deleting joke:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://moderate-jokes-microservice-production.up.railway.app/jokes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        handleDeleteFromSQLDB(id);
        const updatedJokes = jokes.filter((joke) => joke._id !== id);
        setJokes(updatedJokes);
        if (editJokeId === id) {
          setEditJokeId(null);
          setEditType("");
          setEditContent("");
          setEditStatus("");
        }
      } else {
        throw new Error("Failed to delete joke");
      }
    } catch (error) {
      console.error("Error deleting joke:", error);
    }
  };

  const confirmDelete = (id: number) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this joke?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  if (jokes.length === 0) {
    return (
      <div>
        <Navbar type="admin" />
        <div className="flex items-center justify-center h-screen">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05113C51.766 0.3676 46.6974 0.446387 41.7345 1.27873C39.2615 1.69443 37.813 4.19778 38.4501 6.62326C39.0872 9.04874 41.571 10.4717 44.0581 10.107C47.9246 9.50664 51.8518 9.51838 55.7016 10.1433C60.793 10.963 65.7093 12.668 70.1712 15.1925C74.6332 17.717 78.5674 21.0181 81.7685 24.9045C84.2789 27.9677 86.3174 31.3455 87.8058 34.9419C88.6792 37.3045 91.5422 39.0409 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar type="admin" />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">View Jokes</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Content</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jokes.map((joke) => (
                <tr key={joke._id}>
                  <td className="py-2 px-4 border-b">
                    {editJokeId === joke._id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                      >
                        {types.map((type) => (
                          <option key={type._id} value={type.type}>
                            {type.type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      joke.type
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editJokeId === joke._id ? (
                      <textarea
                        className="border rounded px-2 py-1 w-full"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                    ) : (
                      joke.content
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editJokeId === joke._id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      joke.status
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editJokeId === joke._id ? (
                      <>
                        <button
                          className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                          onClick={() => handleSaveChanges(joke._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white py-1 px-2 rounded"
                          onClick={() => {
                            setEditJokeId(null);
                            setEditType("");
                            setEditContent("");
                            setEditStatus("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                          onClick={() => handleEdit(joke._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                          onClick={() => confirmDelete(joke._id)}
                        >
                          Delete
                        </button>
                        <button
                          className={`${joke.status === "approved" ? "bg-green-300 text-white py-1 px-2 rounded mr-2" : "  bg-green-500 text-white py-1 px-2 rounded mr-2"}`}
                          onClick={() => handleAddToDB(joke)}
                          disabled={joke.status === "approved"}
                        >
                          {joke.status === "approved"
                            ? "Added to MySQL"
                            : "Add to MySQL"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewJokes;
