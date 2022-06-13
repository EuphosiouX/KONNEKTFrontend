import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import data from './data.json';
import Jobs from './components/Jobs'
import Header from './components/Header'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Job from './components/Job';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import Profile from './components/Profile';
import AuthProvider from './contexts/AuthContext';
import Dashboard from "./components/Dashboard";
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Forgot from './components/Forgot'
import CompanySignUp from "./components/CompanySignUp";
import CompanyDashboard from "./components/CompanyDashboard";
import UpdateCredentials from "./components/UpdateCredentials";

function App() {
    // console.log(data)
    return (
        <div>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route element={<PublicRoute/>}>
                            <Route path='/signup' element={<SignUp/>}/>
                            <Route path='/signin' element={<SignIn/>}/>
                            <Route path='/forgot' element={<Forgot/>}/>
                            <Route path='/companysignup' element={<CompanySignUp/>}/>
                        </Route>
                        <Route element={<PrivateRoute/>}>
                            <Route exact path='/' element={<Dashboard/>}/>
                            <Route path='/companydashboard' element={<CompanyDashboard/>}/>
                            <Route path='/updatecredentials' element={<UpdateCredentials/>}/>
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;