
type AdminPagePatient =  {
    children?: React.ReactNode
};


function AdminPagePatient ({children}: AdminPagePatient) {
    return <>
    <h1>Hello Admin </h1>
    {children}
    </>
};

export default AdminPagePatient;