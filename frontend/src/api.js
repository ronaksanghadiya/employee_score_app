import axios from 'axios';

const API_BASE_URL = 'http://employeescoreapp-production.up.railway.app/api';

export const addEmployee = async (employeeData) => {
  const response = await axios.post(`${API_BASE_URL}/employee/add`, employeeData, {
    withCredentials: true
  });
  console.log(response);
  return response.data;
};
export const getEmployeeById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/employee/getemp/${id}`, { withCredentials: true });
  console.log(res);
  return res.data;
};
export const submitScorecard = async (id, scorecardData) => {
  const res = await axios.post(
    `http://employeescoreapp-production.up.railway.app/api/employee/${id}/scorecard`,
    scorecardData,
    {
      withCredentials: true
    }
  );
  return res.data;
};
