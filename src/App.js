import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from './component/Register/Register';
import Login from './component/Login/Login';
import Profile from './component/Profile/Profile';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';
import Homepage from './component/Homepage/Homepage';
import FAQsPage1 from './component/FAQs/FAQsLandingPage';
import FAQsPage2 from './component/FAQs/FAQsPage';


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
          <Route path="/faqs" element={<FAQsPage1 />} />
          <Route path="/faqs/parents" element={<FAQsPage2 section="parents" />} />
          <Route path="/faqs/babysitters" element={<FAQsPage2 section="babysitters" />} />
 
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;