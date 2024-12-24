import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BabysitterSignUp from './component/SignUp/BabysitterSignUp';
import ParentSignUp from './component/SignUp/ParentSignUp';
import SignUpLandingPage from './component/SignUp/SignUpLandingPage';
import Login from './component/Login/Login';
import Profile from './component/Profile/Profile';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';
import Homepage from './component/Homepage/Homepage';
import FAQsPage1 from './component/FAQs/FAQsLandingPage';
import FAQsPage2 from './component/FAQs/FAQsPage';
import SpecificationsPage from './component/Footer/SpecificationsPage';
import TermsPage from './component/Footer/TermsPage';
import WhatIsBabysitters from './component/Footer/WhatIsBabysitters';

//hey Giannh!!

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar />
      <div className="main">
        <Routes>
        <Route path="/" element={<Homepage />} /> {/* Changed to Homepage */}
          <Route path="profile" element={<Profile/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-landing" element={<SignUpLandingPage />} />
          <Route path="/signup-parent" element={<ParentSignUp />} />
          <Route path="/signup-babysitter" element={<BabysitterSignUp />} />
          <Route path="/faqs" element={<FAQsPage1 />} />
          <Route path="/faqs/parents" element={<FAQsPage2 section="parents" />} />
          <Route path="/faqs/babysitters" element={<FAQsPage2 section="babysitters" />} />
          <Route path="/about" element={<WhatIsBabysitters />} />
          <Route path="/faqs" element={<FAQsPage2 />} />
          <Route path="/specifications" element={<SpecificationsPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}
export default App;
