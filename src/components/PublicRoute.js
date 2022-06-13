import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = () => {

    const { currentUser } = useAuth()

    return (
        !currentUser ? <Outlet/>  : <Navigate to='/' />
    )
}

export default PublicRoute