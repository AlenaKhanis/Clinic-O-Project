
type DoctorHomePage =  {
    children?: React.ReactNode
};


function DoctorHomePage ({children}: DoctorHomePage) {
    return <>
    <h1>Hello Doctor </h1>
    {children}
    </>
};

export default DoctorHomePage;
