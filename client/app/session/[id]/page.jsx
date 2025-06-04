'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { fetchWithAuth } from '../../utils/fetch';
import Logout from '@/components/Logout';


const page = () => {
  const params = useParams()
  const id = params.id  // session id
  
  const [session, setSession] = useState(null)
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  const [token, setToken] = useState(null)

  const date = new Date(session?.created_at)
  const created = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const getSessionDetail = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5001/sessions/${id}`, {}, token)
      const data = await res.json()
      setSession(data)
      setDuration(data.duration)
      setNotes(data.notes)

    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('accessToken'));
  }, [])

  useEffect(() => {
    if (!token) return;
    getSessionDetail()
  }, [token])

  // updates session
  const updateSession = async () => {
    try {
      await fetchWithAuth(`http://localhost:5001/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          duration: duration,
          notes: notes
        })
      }, token)
      getSessionDetail()
      closeModal()
    } catch (err) {
      console.log(err.message)
    }
  }

  // deletes session
  const deleteSession = async () => {
    try {
      await fetchWithAuth(`http://localhost:5001/sessions/${id}`, {
        method: 'DELETE',
      }, token)
      router.back()
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className='bg-[#1e1e1e] h-screen'>
       <Logout />
      <div className="w-[80%] mx-auto pt-20">
        <h1 className="text-white text-4xl font-semibold">Session - {created}</h1>  
        <h2 className='text-white text-2xl mt-4'>Duration - {session?.duration} min</h2>

        <h2 className='text-white text-2xl mt-4'>Notes</h2>
        <textarea className='bg-[#d9d9d9] w-full p-2 mt-3' rows='10' value={session?.notes} disabled ></textarea>

        <div className='flex justify-between'>
          <div></div>
          <div className='flex gap-4'>
            <button onClick={openModal} className="text-white font-semibold my-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">Edit</button>
            <button onClick={deleteSession} className="text-white font-semibold my-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Delete</button>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={open}>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <label className='text-lg'>Duration (min)</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} type="text" className='border-b border-gray-500 my-2'/>
            </div>
            <div className='flex items-center gap-4'>
              <label className='text-lg'>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className='border p-2' rows='4' cols="50">
              </textarea>
            </div>
          </div>
          <div className='flex gap-4 mt-8'>
              <button onClick={updateSession} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
              <button onClick={closeModal} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
          </div>
        </Modal>

      </div>
    </div>
  )
}

export default page