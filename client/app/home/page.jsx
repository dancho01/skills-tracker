'use client'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '../utils/fetch';
import Logout from '@/components/Logout';

export default function Home() {
  const [allSkills, setAllSkills] = useState([])
  const [skill, setSkill] = useState('')
  const [level, setLevel] = useState('beginner')
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  const router = useRouter();
  const [token, setToken] = useState(null)

  // Add new skill
  const addSkill = async () => {
    try {
      await fetchWithAuth('http://localhost:5001/skills', {
        method: 'POST',
        body: JSON.stringify({
          skill: skill,
          level: level
        })
      }, token)

      closeModal()
      setSkill('')
      getSkills()

    } catch (err) {
      console.log(err.message)
    }
  }

  const getSkills = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5001/skills', {}, token)
      const data = await res.json()
      setAllSkills(data)
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
    getSkills()
  }, [token])

  return (
    <div className="bg-[#1e1e1e] h-screen">
      <Logout />
      <div className="w-[80%] mx-auto pt-20">
        <h1 className="text-white text-4xl font-semibold">Skill Tracker</h1>  
        
        <div className='flex justify-between items-center mt-10'>
          <h1 className='text-2xl font-medium text-white'>My Skills</h1>
          <button onClick={openModal} className="text-white font-medium my-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Add Skill</button>
        </div>

        {/* List of all skills*/}
        <div className="flex flex-col gap-4">
          {allSkills.map(item => (
            <div key={item.id} className="bg-[#d9d9d9] flex justify-between px-6 py-2">
            <div className="flex gap-2"> 
              <h1 className="font-medium">{item.skill}</h1>
              <h2 className="text-gray-700 italic">{item.level}</h2>
            </div>
            <div className='hover:cursor-pointer' onClick={() => router.push(`/skill/${item.id}`)}>
              <ArrowForwardIcon />
            </div>
          </div>
          ))}

          {/* Modal */}
          <Modal isOpen={open}>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <label className='text-lg'>Skill</label>
                <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} className='border-b border-gray-500 my-2'/>
              </div>
              <div className='flex items-center gap-4'>
                <label className='text-lg'>Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className='border border-gray-400'>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className='flex gap-4 mt-8'>
                <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
                <button onClick={closeModal} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
              </div>
          </Modal>


        </div>
      </div>      
    </div>
  );
}
