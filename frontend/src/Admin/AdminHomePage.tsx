

import "../css/adminPage.css"

type AdminPagePatient =  {
    children?: React.ReactNode
};


function AdminPagePatient ({children}: AdminPagePatient) {
    return <>
  <header>
    <h1>Notifications and Updates</h1>
    <nav>
      <ul>
        <li><a href="#notifications">Notifications</a></li>
        <li><a href="#updates">Updates</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="notifications">
      <h2>Notifications</h2>
    </section>
    <section id="updates">
      <h2>Updates</h2>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 Your Company</p>
  </footer>
    {children}
    </>
};

export default AdminPagePatient;