import React from 'react'

function Logout() {
  const handleLogout = () => { // Clear token from localStorage
  localStorage.removeItem('token') 
  localStorage.removeItem('user')
  navigate('/') }
  return (
    <div>Logout</div>
  )
}

export default Logout