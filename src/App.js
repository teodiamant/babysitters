import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from './component/Register/Register';
import Login from './component/Login/Login';
import Profile from './component/Profile';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';

//hey Giannh!!


function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="profile" element={<Profile/>} />
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register/>} />
          
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;