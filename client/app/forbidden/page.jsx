'use client'

import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-[#1e1e1e] text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
        <p className="text-lg text-white">You do not have permission to access this page.</p>
        <button onClick={() => router.push('/')} className='text-white mt-4 text-lg bg-blue-800 hover:bg-blue-900 p-2 rounded hover:cursor-pointer'>Go back</button>
      </div>
    </div>
  )
}

export default page