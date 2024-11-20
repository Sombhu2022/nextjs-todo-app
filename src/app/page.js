"use client";

import { getKeyFromUrl } from "@/utils/getPublicKey";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function Page() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of todos per page

  const route = useRouter();

  const fetchTodoData = async () => {
    try {
      setLoading(true);
      const fetchData = await axios.get("/api/todo");
      setData(fetchData.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setMessage("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const confirmUpload = window.confirm(`Are you sure you want to upload ${file.name}?`);
    if (!confirmUpload) {
      setMessage("File upload canceled.");
      return;
    }

    try {
      setIsUploadSuccess(false);
      setMessage("");
      // genarate pre sign url 
      const response = await axios.post(`/api/todo/new/create-preSign-url`, {
        fileName: file.name,
        type: file.type,
      });

      const { url } = response.data;
     // upload file in AWS S3 bucket 
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        // progress bar 
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setMessage("File uploaded successfully!");
      setUploadProgress(0);
      setIsUploadSuccess(true);
      setUploadedFileUrl(url.split("?")[0]); // Remove query params from URL
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file.");
      setIsUploadSuccess(false);
    }
  };

  const todoHandle = async (e) => {
    e.preventDefault();

    if (!file && !caption) {
      setMessage("Please provide either a file or a caption.");
      return;
    }

    try {
      setLoading(true);
      const key = getKeyFromUrl(uploadedFileUrl)
      console.log(key);
      
      if (!uploadedFileUrl || !caption || !key) {
        return alert("All fields are required!");
      }


      await axios.post(
        "/api/todo/new",
        { url: uploadedFileUrl, message: caption , key: key},
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("Todo added successfully!");
      setFile(null);
      setCaption("");
      window.location.reload()
    } catch (error) {
      console.error("Error submitting todo:", error);
      setMessage("Failed to add todo.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setMessage("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
  });

  useEffect(() => {
    fetchTodoData();
  }, []);

  useEffect(() => {
    if (file) handleUpload();
  }, [file]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-wrap gap-8 justify-center min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 p-5">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-transparent border-solid animate-spin rounded-full border-purple-500 border-4 h-12 w-12"></div>
        </div>
      ) : (
        <>
          <div>
            <form
              className="w-full max-w-md px-10 py-8 bg-white border rounded-lg shadow-lg flex flex-col gap-4"
              onSubmit={todoHandle}
            >
              <h2 className="text-3xl font-semibold text-purple-700 text-center mb-4">Add Todo</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-300 ${
                  isDragActive ? "border-purple-500 bg-purple-100" : "border-gray-300 bg-gray-100 hover:border-purple-400"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <p className="text-sm text-purple-600">Selected File: {file.name}</p>
                ) : (
                  <p className="text-gray-500">
                    Drag & drop a file here, or{" "}
                    <span className="text-purple-500 underline cursor-pointer">browse</span>
                  </p>
                )}
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-purple-500 h-4 rounded-full text-center text-xs text-white transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
              {isUploadSuccess && uploadedFileUrl && (
                <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg mt-2">
                  <span className="text-green-700 text-sm">File uploaded successfully!</span>
                  <a
                    href={uploadedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 underline text-sm"
                  >
                    Show File
                  </a>
                </div>
              )}
              <textarea
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
                placeholder="Enter caption"
                rows={2}
              ></textarea>
              <input
                className="border rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-3 cursor-pointer transition duration-300"
                type="submit"
                value="Submit"
              />
            </form>
          </div>
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-semibold text-purple-700 text-center mb-6">Todo List</h2>
            {currentData.map((ele, index) => (
              <div
                key={index}
                className="block border rounded-lg border-gray-300 shadow-md p-5 my-3 bg-white hover:bg-purple-100 transition duration-300"
              >
                <h3 className="text-xl font-medium text-gray-800">{ele.message}</h3>
                <p className="text-gray-600">
                  {ele.file?.url ? (
                    <a
                      className="underline text-blue-600 hover:text-blue-900 cursor-pointer"
                      href={ele.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Show file
                    </a>
                  ) : (
                    "No file attached"
                  )}
                </p>
                <Link
                  href={`/todo/${ele._id}`}
                  className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition duration-300"
                >
                  Edit
                </Link>
              </div>
            ))}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1 ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
