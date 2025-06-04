import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = () => {
  const router = useRouter();

  const logout = async () => {
    await fetch('http://localhost:5001/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    localStorage.removeItem('accessToken');    
    router.push('/')
  }

  return (
    <button onClick={logout} className='bg-blue-700 hover:bg-blue-800 text-white font-medium p-2 rounded right-3 top-3 absolute hover:cursor-pointer'>Logout</button>
  )
}

export default Logout