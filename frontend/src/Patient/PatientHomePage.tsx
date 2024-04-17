
type HomePagePatient = {
  children?: React.ReactNode
  
}

function HomePagePatient ({children}: HomePagePatient) {
  console.log("im in patient page!");
    return <>
    <h1>Hello Patient </h1>
    <h1>This it the patient content</h1>
    </>
};

export default HomePagePatient
