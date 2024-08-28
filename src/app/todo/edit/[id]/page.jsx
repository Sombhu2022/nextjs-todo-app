"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading
  const route = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading to true when updating
      await axios.patch(`/api/todo/${id}`, { name, message });
      setLoading(false); // Set loading to false after update
      route.push(`/todo/${id}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTodo = async (id) => {
      try {
        setLoading(true); // Set loading to true when fetching data
        const { data } = await axios.get(`/api/todo/${id}`);
        if (data) {
          setName(data.name);
          setMessage(data.message);
        }
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log(error);
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchTodo(id);
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 p-5">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-transparent border-solid animate-spin rounded-full border-purple-500 border-4 h-12 w-12"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-purple-700 text-center mb-6">
            Update Todo
          </h2>

          <form
            className="w-full max-w-md px-10 py-8 bg-white border rounded-lg shadow-lg flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              className="input-filed border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Enter message"
              rows={2}
              cols={5}
            ></textarea>
            <button
              type="submit"
              className="w-full px-5 py-3 text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition duration-300 font-semibold"
            >
              Update
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default page;
