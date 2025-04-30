import axios from "axios";

const API_BASE_URL = "http://localhost:8080/employees";

export type EmployeeType = {
  id: number;
  cpf: string;
  name: string;
  position: string;
  salary: number;
  workload: number;
};

export const useEmployee = () => {
  const getAllEmployees = async (): Promise<EmployeeType[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  };

  const updateEmployee = async (
    id: number,
    data: Partial<EmployeeType>
  ): Promise<EmployeeType> => {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, data);
    return response.data;
  };

  const deleteEmployee = async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  };

  const createEmployee = async (
    data: Omit<EmployeeType, "id">
  ): Promise<EmployeeType> => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  };

  return {
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
    createEmployee,
  };
};
