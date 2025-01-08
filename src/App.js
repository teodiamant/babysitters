import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BabysitterSignUp from './component/SignUp/BabysitterSignUp';
import ParentSignUp from './component/SignUp/ParentSignUp';
import SignUpLandingPage from './component/SignUp/SignUpLandingPage';
import Login from './component/Login/Login';
import ParentProfile from './component/Profile/ParentProfile'; 
import BabysitterProfile from './component/Profile/BabysitterProfile';
import BabysitterSettings from './component/UserSettings/BabysitterSettings';
import ParentSettings from './component/UserSettings/ParentSettings'; 
import Profile from './component/Profile/Profile';
import EditBabysitterProfile from './component/Profile/editBabysitterProfile';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';
import MakeContract from './component/MakeContract/MakeContract';
import LandingPage from './component/Homepage/LandingPage';
import FAQsPage1 from './component/FAQs/FAQsLandingPage';
import FAQsPage2 from './component/FAQs/FAQsPage';
import SpecificationsPage from './component/Footer/SpecificationsPage';
import TermsPage from './component/Footer/TermsPage';
import WhatIsBabysitters from './component/Footer/WhatIsBabysitters';
import Search from './component/Search/Search';
import BabysitterDetails from './component/BabysitterDetails/BabysitterDetails';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Ensure full viewport height
          }}
        >
          <main
            style={{
              flexGrow: 1, // Allow main content to grow and push footer to the bottom
              padding: "20px", // Optional padding for content
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/make-contract" element={<MakeContract />} />
              <Route path="/edit-babysitter-profile" element={<EditBabysitterProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup-landing" element={<SignUpLandingPage />} />
              <Route path="/signup-parent" element={<ParentSignUp />} />
              <Route path="/signup-babysitter" element={<BabysitterSignUp />} />
              <Route path="/babysitters/:id" element={<BabysitterDetails />} />
              <Route path="/babysitter-settings/:userId" element={<BabysitterSettings />} />
              <Route path="/paernt-settings" element={<ParentSettings />} />
              <Route path="/faqs" element={<FAQsPage1 />} />
              <Route path="/faqs/parents" element={<FAQsPage2 section="parents" />} />
              <Route path="/faqs/babysitters" element={<FAQsPage2 section="babysitters" />} />
              <Route path="/about" element={<WhatIsBabysitters />} />
              <Route path="/specifications" element={<SpecificationsPage />} />
              <Route path="/parent-profile/:id" element={<ParentProfile/>} />
              <Route path="/babysitter-profile/:email" element={<BabysitterProfile />} />
              <Route path="/terms" element={<TermsPage />} />
              {/* If you need profiles for babysitters or parents, add routes here */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}
export default App;
