"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
  const { id } = useParams();
  const route = useRouter();
  const [todoData, setTodoData] = useState({});
  const [loading , setLoading] = useState(true)
  
  const fetchData = async (id) => {
    try {
      setLoading(true)
      const data = await axios.get(`/api/todo/${id}`);
      if (data) {
        setTodoData(data.data);
      }
      setLoading(false)
      
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      route.push('/');
      
    } catch (error) {
       console.error(error)
    }
  }

  useEffect(() => {
    fetchData(id);
  }, [id]);
  

  if(loading){
    return(
    <div className='flex flex-col gap-8 justify-center items-center min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 p-5'>

      <div className='flex justify-center items-center'>
          <div className='loader border-t-transparent border-solid animate-spin rounded-full border-purple-500 border-4 h-12 w-12'></div>
        </div>
        </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 p-5'>
      <h3 className='text-3xl font-semibold text-purple-700 text-center mb-6'>Display Todo Data</h3>
      
      <div className='w-full max-w-lg bg-white border rounded-lg shadow-lg p-6'>
        
        <p className='text-gray-600 mb-6'>{todoData?.data?.message}</p>
        
        <div className="flex justify-between gap-4">
          <button 
            className='w-full px-5 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-300'
            onClick={() => route.push(`/todo/edit/${id}`)}
          > 
            Edit 
          </button>
          <button 
            className='w-full px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-300'
            onClick={() => handleDelete(id)}
          > 
            Delete 
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
