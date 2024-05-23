import { useLocation } from "react-router-dom";
import Footer from "../HomePage/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>
            <div className="content">
                {children}
            </div>
            {isHomePage && <Footer />}
        </>
    );
};

export default Layout;
