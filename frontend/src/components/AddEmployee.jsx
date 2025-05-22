import React, { useState } from 'react';
import { addEmployee } from '../api.js';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    job_code: '',
    designation: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res= await addEmployee(formData);
      alert(res.message);
      // Optional: clear form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        job_code: '',
        designation: ''
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-3">Add Employee</h4>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              name="phone_number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Job Code"
              name="job_code"
              value={formData.job_code}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

export default AddEmployee;
