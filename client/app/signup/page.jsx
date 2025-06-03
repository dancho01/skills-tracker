'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const router = useRouter();

  const signup = async () => {

    if (password !== confirm) {
      setError('Passwords do not match')
      return;
    }
    setError('');

    try {
      await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      router.push('/')
    } catch (err) {
      console.log(err.message)
    }
    
  }

  return (
    <div className='bg-[#1e1e1e] h-screen'>
      <div className='flex flex-col items-center'>
        <h1 className='text-white text-4xl font-semibold mt-20'>Sign Up</h1>
        <div className='w-[500px] mt-10 bg-[#d9d9d9] flex flex-col mx-auto p-8 gap-6'>
          <div className='flex flex-col'>
            <label className='font-medium'>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='border rounded-sm p-1'/>
          </div>
          <div className='flex flex-col'>
            <label className='font-medium'>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='border rounded-sm p-1'/>
          </div>
          <div className='flex flex-col'>
            <label className='font-medium'>Confirm Password</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className='border rounded-sm p-1'/>
          </div>
          {error && <p className='bg-red-500 p-1 text-white font-medium'>{error}</p>}
          <button onClick={signup} className='p-1 mt-5 rounded bg-blue-700 hover:bg-blue-600 text-white font-medium'>Submit</button>
        </div>

        <div className='mt-5'>
          <p className='text-white font-medium'>Already have an account? <Link href='/' className='text-blue-600 underline hover:cursor-pointer'>Login here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default page