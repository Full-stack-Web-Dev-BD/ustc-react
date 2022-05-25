import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
// pages
import Home from './pages/Home';
import NavBar from './component/NavBar' 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"; 
export const App = () => {
    return (
        <Router>
            <ToastContainer />
            <div>
                <NavBar />
            </div>
            <div className='app'>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>

    )
}
