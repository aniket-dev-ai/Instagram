import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import GetProfile from './Pages/GetProfile'
import EditProfile from './Pages/EditProfile'

const Routing = () => {
  return (
    <div>
        <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:id/GetProfile" element={<GetProfile />} />           
            <Route path="/:id/EditProfile" element={<EditProfile />} />           
        </Routes>
    </div>
)
}

export default Routing