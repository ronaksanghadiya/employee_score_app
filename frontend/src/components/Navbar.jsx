// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [user, setUser] = useState(null);

//   // Fetch the user data after login
//   useEffect(() => {
//     axios.get('http://localhost:5000/me', {
//       withCredentials: true
//     })
//       .then(response => {
//         console.log(response);
//         setUser(response.data.user);
//       })
//       .catch(() => {
//         setUser(null);
//       });
//   }, []);



//   const handleLogin = () => {
//     window.location.href = 'http://localhost:5000/auth/login';
//   };

//   const handleLogout = () => {
//     window.location.href = 'http://localhost:5000/logout';
//   };

//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Employee Portal
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">

//           <div className="d-flex align-items-center">
//             {user ? (
//               <>
//                 <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/">
//                       Home
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/addForm">
//                       Add Employee
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/getEmployee">
//                       Get Employee
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/getAllEmployee">
//                       Get All Employee
//                     </Link>
//                   </li>
//                 </ul>
//                 {user && user.oid && (
//                   <div className="text-black">Welcome, {user.oid.displayName} </div>
//                 )}
//                 &nbsp;
//                 <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <button className="btn btn-outline-primary btn-sm" onClick={handleLogin}>
//                 Login with Azure AD
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/me', {
      withCredentials: true
    })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/login';
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Employee Portal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/addForm">Add Employee</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/getEmployee">Get Employee</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/getAllEmployee">Get All Employee</Link>
                </li>
              </>
            )}
          </ul>

          {/* Right side login/logout */}
          <div className="d-flex align-items-center ms-auto">
            {user ? (
              <>
                {user.oid && (
                  <span className="me-2 text-dark">Welcome, {user.oid.displayName}</span>
                )}
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="btn btn-outline-primary btn-sm" onClick={handleLogin}>
                Login with Azure AD
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
