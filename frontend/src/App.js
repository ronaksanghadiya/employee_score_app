import React from 'react';
import {Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import AddEmployee from './components/AddEmployee';
import GetEmployee from './components/GetEmployee';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';

function App() {
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   // Check if user is authenticated, e.g., session cookie or token
  //   fetch('http://localhost:5000/api/check-auth', { credentials: 'include' })
  //     .then(res => res.json())
  //     .then(data => setAuthenticated(data.authenticated));
  // }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/addForm" element={<AddEmployee />} />
        <Route path="/getEmployee" element={<GetEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/getAllEmployee" element={<EmployeeList />} />
        {/* <Route path="/" element={authenticated ? <Navigate to="/employees" /> : <Login />} /> */}
        {/* <Route path="/employees" element={authenticated ? <EmployeeList /> : <Navigate to="/" />} /> */}
      </Routes>


    </>

  );
}

export default App;
