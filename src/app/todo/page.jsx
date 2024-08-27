"use client"

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function page() {
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true) // State to manage loading

  const fetchTodoData = async () => {
    try {
      
      setLoading(true) // Start loading
      const fetchData = await axios.get('/api/todo')
      console.log("data", fetchData);
      setData(fetchData.data)
      setLoading(false) // Stop loading after data is fetched
    } catch (error) {
      console.log(error);
      setLoading(false) // Stop loading after data is fetched
      
    }
  }

  const todoHandle = async (e) => {
    e.preventDefault()
    try {
      
      setLoading(true) // Start loading
      const data = await axios.post("/api/todo/new", { name, message })
      
      setData(data.data)
      setLoading(false) // Stop loading after data is submitted
    } catch (error) {
      console.log(error);
      setLoading(false) // Stop loading after data is submitted
      
    }
  }

  useEffect(() => {
    fetchTodoData();
  }, [])

  return (
    <div className='flex flex-col gap-8 justify-center items-center min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 p-5'>
      {loading ? (
        <div className='flex justify-center items-center'>
          <div className='loader border-t-transparent border-solid animate-spin rounded-full border-purple-500 border-4 h-12 w-12'></div>
        </div>
      ) : (
        <>
          <form className='w-full max-w-md px-10 py-8 bg-white border rounded-lg shadow-lg flex flex-col gap-4' onSubmit={todoHandle}>
            <h2 className='text-3xl font-semibold text-purple-700 text-center mb-4'>Add Todo</h2>
            <input className='input-filed border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='Enter name' />
            <input className='input-filed border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' type="text" onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Enter message' />
            <input className='border rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-3 cursor-pointer transition duration-300' type="submit" value="Submit" />
          </form>

          <div className='w-full max-w-lg'>
            <h2 className='text-3xl font-semibold text-purple-700 text-center mb-6'>Todo List</h2>
            {data?.map((ele, index) => {
              return (
                <Link href={`/todo/${ele._id}`} key={index} className='block border rounded-lg border-gray-300 shadow-md p-5 my-3 bg-white hover:bg-purple-100 transition duration-300'>
                  <h3 className='text-xl font-medium text-gray-800'>{ele.name}</h3>
                  <p className='text-gray-600'>{ele.message}</p>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default page
