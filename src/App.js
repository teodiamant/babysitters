import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from './component/Register/Register';
import Login from './component/Login/Login';
import Profile from './component/Profile/Profile';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';
import Homepage from './component/Homepage/Homepage';

//hey Giannh!!


function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar />
        <Routes>
        <Route path="/" element={<Homepage />} /> {/* Changed to Homepage */}
          <Route path="profile" element={<Profile/>} />
          <Route path="/login" element={<Login />} />
          <Route path="register" element={<Register/>} />
          
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;