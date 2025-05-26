"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from '@/components/Modal';
import { duration } from '@mui/material';
import { useRouter } from 'next/navigation';

const page = () => {
  const [skill, setSkill] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [sessions, setSessions] = useState([])
  const params = useParams()
  const id = params.id
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  const router = useRouter();

  const getSkill = async () => {
    try {
      const res = await fetch(`http://localhost:5001/skills/${id}`)
      const data = await res.json()
      setSkill(data.skill)
    } catch (err) {
      console.log(err.message)
    }
  }

  // posts a new session
  const addSession = async () => {
    try {
      await fetch(`http://localhost:5001/sessions/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          duration: duration,
          notes: notes
        })
      })
      closeModal()
      getSessions()
    } catch (err) {
      console.log(err.message)
    }
  }

  // get all the sessions for the skill 
  const getSessions = async () => {
    try {
      const res = await fetch(`http://localhost:5001/sessions/skill/${id}`)
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getSkill()
    getSessions()
  }, [])

  // TODO
  const updateSkill = async () => {
    try {
      await fetch(`http://localhost:5001/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          level: level
        })
      })

    } catch (err) {
      console.log(err.message)
    }
  }

  const deleteSkill = async () => {
    try {
      await fetch(`http://localhost:5001/skills/${id}`, {
        method: 'DELETE'
      })
      router.back()
    } catch (err) {
      console.log(err.message)
    }
  }
  
  return (
    <div className="bg-[#1e1e1e] h-screen">
      <div className="w-[80%] mx-auto pt-20">
        <h1 className="text-white text-4xl font-semibold">{skill}</h1>  
        <h2 className='text-white text-2xl mt-4'>Level: Intermediate</h2>

        <div className='flex gap-4 mt-4'>
          <button onClick={updateSkill} className="text-white font-semibold bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">Update Level</button>
          <button onClick={deleteSkill} className="text-white font-semibold bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Delete Skill</button>
        </div>
     
        <div className='flex justify-between items-center mt-10'>
          <h1 className='text-2xl font-medium text-white'>Sessions</h1>
          <button onClick={openModal}  className="text-white font-medium my-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Log Session</button>
        </div>

        <div className="flex flex-col gap-4">      
          {sessions.map((item, index) => (
              <div key={item.id}  className="bg-[#d9d9d9] flex justify-between px-6 py-2">
                <div className="flex gap-2"> 
                  <h1 className="font-medium">Session {index + 1}</h1>
                  <h2 className="text-gray-700">{item.created_at}</h2>
                </div>
                <div className='hover:cursor-pointer' onClick={() => router.push(`/session/${item.id}`)}>
                  <ArrowForwardIcon />
                </div>
              </div>
          ))}        
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
              <button onClick={addSession} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
              <button onClick={closeModal} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
          </div>
        </Modal>


      </div>
    </div>
  )
}

export default page