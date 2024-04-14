import { useState } from "react";
import BlogSection from "./HomePage/BlogSection";
import MainPage, { MainBody } from "./HomePage/HomePage";
import LoginForm from "./HomePage/LoginForm";
import Register from "./HomePage/RegisterForm";
import Footer from "./HomePage/Footer";


function App() {

    const [showLoginPopup, setShowLoginPopup] = useState(false); // Login PopUp
    const [showRegisternPopup, setShowRegisterPopup] = useState(false); // Register PopUp
    const [, setUserToken] = useState<string | null>(null);

    return  <>
        <MainPage setShowLoginPopup={setShowLoginPopup}/>
        <div className="body-content" style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
            <MainBody setShowRegisterPopup={setShowRegisterPopup} />
        </div>
        <div className="blog-content" style={{ marginTop: '-250px' }}>
          <BlogSection />
        </div>
        {showLoginPopup && <LoginForm setShowLoginPopup={setShowLoginPopup} setUserToken={setUserToken}/>}
        {showRegisternPopup && <Register setShowRegisterPopup={setShowRegisterPopup} />}
        <Footer/>
        
    </>
}

export default App