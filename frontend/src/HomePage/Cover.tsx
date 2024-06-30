
import Footer from "../HomePage/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="content">
                {children}
            </div>
            {<Footer />}
        </>
    );
};

export default Layout;
