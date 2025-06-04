"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '../../utils/fetch';
import Logout from '@/components/Logout';


const page = () => {
  const [skill, setSkill] = useState(null)
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [level, setLevel] = useState('')
  const [sessions, setSessions] = useState([])
  const [totalTime, setTotalTime] = useState(0)
  const [token, setToken] = useState(null)
  const params = useParams()
  const id = params.id

  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const [updateModal, setUpdateModal] = useState(false)

  const router = useRouter();

  const getSkill = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5001/skills/${id}`, {}, token)

      if (res.status === 403) {
        router.push('/forbidden')
      }
      
      const data = await res.json()
      setSkill(data)
      setLevel(data.level)
    } catch (err) {
      console.log(err.message)
    }
  }

  // posts a new session
  const addSession = async () => {
    try {
      await fetchWithAuth(`http://localhost:5001/sessions/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          duration: duration,
          notes: notes
        })
      }, token)
      closeModal()
      setDuration('')
      setNotes('')
      getSessions()
      getTotalTime()
    } catch (err) {
      console.log(err.message)
    }
  }

  // get all the sessions for the skill 
  const getSessions = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5001/sessions/skill/${id}`, {}, token)
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  const getTotalTime = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5001/stats/${id}`, {}, token)
      const data = await res.json()
      setTotalTime(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/forbidden');
    } else {
      setToken(token);
    }
  }, [])

  useEffect(() => {
    if (!token) return;
    getSkill()
    getSessions()
    getTotalTime()
  }, [token])

  // updates a skill
  const updateSkill = async () => {
    try {
      await fetchWithAuth(`http://localhost:5001/skills/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          level: level
        })
      }, token)
      getSkill()
      setUpdateModal(false)

    } catch (err) {
      console.log(err.message)
    }
  }

  // deletes a skill
  const deleteSkill = async () => {
    try {
      await fetchWithAuth(`http://localhost:5001/skills/${id}`, {
        method: 'DELETE',
      }, token)
      router.back()
    } catch (err) {
      console.log(err.message)
    }
  }
  
  return (
    <div className="bg-[#1e1e1e] h-screen">
      <Logout />
      <div className="w-[80%] mx-auto pt-20">
        <h1 className="text-white text-4xl font-semibold">{skill?.skill}</h1>  
        <h2 className='text-white text-2xl mt-4'>Level: {skill?.level}</h2>
        <h2 className='text-white text-xl mt-4'>Total Time Practiced: {totalTime} min</h2>

        <div className='flex gap-4 mt-4'>
          <button onClick={() => setUpdateModal(true)} className="text-white font-semibold bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">Update Level</button>
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


        <Modal isOpen={updateModal}>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <label className='text-lg'>Skill</label>
                <input type="text" value={skill?.skill} disabled className='border-b border-gray-500 my-2'/>
              </div>
              <div className='flex items-center gap-4'>
                <label className='text-lg'>Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}  className='border border-gray-400'>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className='flex gap-4 mt-8'>
                <button onClick={updateSkill} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
                <button onClick={() => setUpdateModal(false)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
              </div>
          </Modal>


      </div>
    </div>
  )
}

export default page