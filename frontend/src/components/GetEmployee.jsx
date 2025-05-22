import React, { useState } from 'react';

import { getEmployeeById, submitScorecard } from '../api';

const GetEmployee = () => {
    const [empId, setEmpId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [scorecard, setScorecard] = useState({
        shoulder_error: '',
        back_error: '',
        knee_error: '',
        total_error: '',
        green_percentage: '',
        red_percentage: ''
    });

    const handleSearch = async () => {
        try {
            if (!empId.trim()) return alert("Enter a valid ID");
            const res = await getEmployeeById(empId);
            setEmployee(res);

            // If scorecard exists, populate it; otherwise reset
            if (res.scorecard) {
                setScorecard({
                    shoulder_error: res.scorecard.shoulder_error || '',
                    back_error: res.scorecard.back_error || '',
                    knee_error: res.scorecard.knee_error || '',
                    total_error: res.scorecard.total_error || '',
                    green_percentage: res.scorecard.green_percentage || '',
                    red_percentage: res.scorecard.red_percentage || ''
                });
            } else {
                setScorecard({
                    shoulder_error: '',
                    back_error: '',
                    knee_error: '',
                    total_error: '',
                    green_percentage: '',
                    red_percentage: ''
                });
            }

        } catch (error) {
            alert('Employee not found');
            console.error(error);
        }
    };


    const handleScoreSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitScorecard(empId, scorecard);
            alert('Scorecard submitted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to submit scorecard');
        }
    };

    const handleScoreChange = (e) => {
        setScorecard({ ...scorecard, [e.target.name]: e.target.value });
    };



    return (
        <div className="container">
            <h4>Get Employee</h4>
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Employee ID"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary mt-2" type="button" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            {employee && (
                <div className="mt-4">
                    <h5>Employee Details</h5>
                    <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.phone_number}</p>
                    <p><strong>Designation:</strong> {employee.designation}</p>

                    <form onSubmit={handleScoreSubmit} className="mt-4">
                        <h5>Submit Scorecard</h5>
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <input type="number" name="shoulder_error" placeholder="Shoulder Error" className="form-control" onChange={handleScoreChange} value={scorecard.shoulder_error}/>
                            </div>
                            <div className="col-md-4">
                                <input type="number" name="back_error" placeholder="Back Error" className="form-control" onChange={handleScoreChange} value={scorecard.back_error}/>
                            </div>
                            <div className="col-md-4">
                                <input type="number" name="knee_error" placeholder="Knee Error" className="form-control" onChange={handleScoreChange} value={scorecard.knee_error}/>
                            </div>
                            <div className="col-md-4">
                                <input type="number" name="total_error" placeholder="Total Error" className="form-control" onChange={handleScoreChange} value={scorecard.total_error} />
                            </div>
                            <div className="col-md-4">
                                <input type="number" name="green_percentage" placeholder="Green %" className="form-control" onChange={handleScoreChange} value={scorecard.green_percentage}/>
                            </div>
                            <div className="col-md-4">
                                <input type="number" name="red_percentage" placeholder="Red %" className="form-control" onChange={handleScoreChange} value={scorecard.red_percentage} />
                            </div>
                        </div>
                        <button className="btn btn-success" type="submit">Submit Scorecard</button>
                    </form>
                </div>
            )}
        </div>
    );
};
export default GetEmployee; 