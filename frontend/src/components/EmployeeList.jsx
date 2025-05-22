// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const API_BASE_URL = 'http://localhost:5000/api'; // adjust as needed

// const EmployeeList = () => {
//     const [employees, setEmployees] = useState([]);

//     const fetchEmployees = async () => {
//         try {
//             const res = await axios.get(`${API_BASE_URL}/employee/all`);

//             setEmployees(res.data);
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//             alert("Failed to load employees");
//         }
//     };
//     console.log(employees);

//     const handleEdit = (id) => {
//         alert(`Edit employee with ID: ${id}`);
//         // Or navigate to edit form
//     };

//     const handleDelete = async (id) => {
//         const confirm = window.confirm("Are you sure to delete?");
//         if (!confirm) return;

//         try {
//             await axios.delete(`${API_BASE_URL}/employee/${id}`);
//             alert("Deleted successfully");
//             fetchEmployees(); // refresh the list
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete");
//         }
//     };

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     return (
//         <div className="container mt-4">
//             <h4>Employee List</h4>
//             <table className="table table-bordered">
//                 <thead className="table-light">
//                     <tr>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>Designation</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {employees.length === 0 ? (
//                         <tr>
//                             <td colSpan="6" className="text-center">No employees found</td>
//                         </tr>
//                     ) : (
//                         employees.map(emp => (
//                             <tr key={emp.id}>
//                                 <td>{emp.id}</td>
//                                 <td>{emp.first_name} {emp.last_name}</td>
//                                 <td>{emp.email}</td>
//                                 <td>{emp.phone_number}</td>
//                                 <td>{emp.designation}</td>
//                                 <td>
//                                     <FaEdit
//                                         style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
//                                         onClick={() => handleEdit(emp.id)}
//                                     />
//                                     <FaTrash
//                                         style={{ cursor: 'pointer', color: 'red' }}
//                                         onClick={() => handleDelete(emp.id)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
// export default EmployeeList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [message, setMessage] = useState('');
    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employee/all`, { withCredentials: true });
            setEmployees(res.data);
        } catch (error) {
            setMessage('Login Please First');
            console.error("Error fetching employees:", error);

        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = (id) => {
        const emp = employees.find(e => e.id === id);
        setSelectedEmployee(emp);
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`${API_BASE_URL}/employee/edit/${selectedEmployee.id}`, selectedEmployee,{ withCredentials: true });
            alert("Updated successfully");
            setEditModalOpen(false);
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure to delete?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/employee/delete/${id}`,{ withCredentials: true });
            alert("Deleted successfully");
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    return (
        message ? (
            <><div style={{ color: 'red' }}>Please login to continue.</div> </>
        ): (
            <>
            <div className = "container mt-4">
            <h4>Employee List</h4 >

        <table className="table table-bordered">
            <thead className="table-light">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center">No employees found</td>
                    </tr>
                ) : (
                    employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.first_name} {emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phone_number}</td>
                            <td>{emp.designation}</td>
                            <td>
                                <FaEdit
                                    style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                                    onClick={() => handleEdit(emp.id)}
                                />
                                <FaTrash
                                    style={{ cursor: 'pointer', color: 'red' }}
                                    onClick={() => handleDelete(emp.id)}
                                />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>

    {/* Edit Modal */ }
    {
        editModalOpen && selectedEmployee && (
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Employee</h5>
                            <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <input
                                className="form-control mb-2"
                                name="first_name"
                                value={selectedEmployee.first_name}
                                onChange={handleEditChange}
                                placeholder="First Name"
                            />
                            <input
                                className="form-control mb-2"
                                name="last_name"
                                value={selectedEmployee.last_name}
                                onChange={handleEditChange}
                                placeholder="Last Name"
                            />
                            <input
                                className="form-control mb-2"
                                name="email"
                                value={selectedEmployee.email}
                                onChange={handleEditChange}
                                placeholder="Email"
                            />
                            <input
                                className="form-control mb-2"
                                name="phone_number"
                                value={selectedEmployee.phone_number}
                                onChange={handleEditChange}
                                placeholder="Phone"
                            />
                            <input
                                className="form-control mb-2"
                                name="designation"
                                value={selectedEmployee.designation}
                                onChange={handleEditChange}
                                placeholder="Designation"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
        </div >
            </>
        )
       
    );
};

export default EmployeeList;
