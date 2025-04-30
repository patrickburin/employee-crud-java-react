import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useEmployee } from "./use-employee";
import { toast } from "react-toastify";

type EmployeeType = {
  id: number;
  cpf: string;
  name: string;
  position: string;
  salary: number;
  workload: number;
};

const Table = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [creating, setCreating] = useState(false);
  const [validateInputs, setValidateInputs] = useState<Record<string, string>>(
    {}
  );
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const showToastInitial = useRef(false);
  const { getAllEmployees, updateEmployee, deleteEmployee, createEmployee } =
    useEmployee();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const formatCpf = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
    return onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);

      if (!showToastInitial.current) {
        toast.success("Funcionários carregados com sucesso!", {
          autoClose: 3000,
          pauseOnFocusLoss: false,
        });
        showToastInitial.current = true;
      }
    } catch (error) {
      toast.error("Erro ao carregar funcionários.", {
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });
    }
  };

  const handleEditEmployee = (employee: EmployeeType) => {
    setEditedEmployee({ ...employee });
    setShowSidebar(true);
    setCreating(false);
  };

  const validatedFields = () => {
    const newErrors: Record<string, string> = {};

    if (!editedEmployee?.name) {
      newErrors.name = `O campo "nome" é obrigatório`;
    }

    if (!editedEmployee?.cpf) {
      newErrors.cpf = `O campo "CPF" é obrigatório`;
    } else {
      const numbersOnly = editedEmployee.cpf.replace(/\D/g, "");
      if (numbersOnly.length !== 11) {
        newErrors.cpf = `O CPF deve conter 11 números válidos`;
      }
    }

    if (!editedEmployee?.position) {
      newErrors.position = `O campo "cargo" é obrigatório`;
    }

    if (editedEmployee?.salary == null || isNaN(editedEmployee.salary)) {
      newErrors.salary = `O campo "salário" é obrigatório`;
    } else if (editedEmployee.salary < 0) {
      newErrors.salary = `O salário não pode ser negativo`;
    }

    if (editedEmployee?.workload == null || isNaN(editedEmployee.workload)) {
      newErrors.workload = `O campo "carga horária" é obrigatório`;
    } else if (editedEmployee.workload < 0) {
      newErrors.workload = `A carga horária não pode ser negativa`;
    }

    setValidateInputs(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEmployee = async () => {
    if (validatedFields() && editedEmployee) {
      try {
        await updateEmployee(editedEmployee.id, editedEmployee);
        await fetchEmployees();
        setShowSidebar(false);
        setEditedEmployee(null);
        setValidateInputs({});
        toast.success("Alterações realizadas com sucesso!", {
          autoClose: 3000,
          pauseOnFocusLoss: false,
        });
      } catch (error: any) {
        const errorMessage =
          error?.response?.data || "Erro ao atualizar funcionário.";
        toast.error(errorMessage, {
          autoClose: 3000,
          pauseOnFocusLoss: false,
        });
      }
    }
  };

  const handleDeleteEmployee = async () => {
    if (!editedEmployee) return;

    try {
      await deleteEmployee(editedEmployee.id);
      await fetchEmployees();
      setShowSidebar(false);
      setEditedEmployee(null);
      setValidateInputs({});
      toast.success("Funcionário excluído com sucesso!", {
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data || "Erro ao excluir funcionário.";
      toast.error(errorMessage, {
        autoClose: 3000,
        pauseOnFocusLoss: false,
      });
    }
  };

  const handleAddEmployee = () => {
    setCreating(true);
    setEditedEmployee({
      id: 0,
      cpf: "",
      name: "",
      position: "",
      salary: 0,
      workload: 0,
    });
    setValidateInputs({});
    setShowSidebar(true);
  };

  const handleCreateEmployee = async () => {
    if (validatedFields() && editedEmployee) {
      try {
        await createEmployee(editedEmployee);
        await fetchEmployees();
        setShowSidebar(false);
        setEditedEmployee(null);
        setCreating(false);
        toast.success("Funcionário adicionado com sucesso!", {
          autoClose: 3000,
          pauseOnFocusLoss: false,
        });
      } catch (error: any) {
        const errorMessage =
          error?.response?.data || "Erro ao adicionar funcionário.";
        toast.error(errorMessage, {
          autoClose: 3000,
          pauseOnFocusLoss: false,
        });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        margin: " 3rem 0",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", width: "90%", alignItems: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", width: "90%" }}>
            Gestão de funcionários
          </div>
          <Button
            label="Adicionar funcionário"
            onClick={handleAddEmployee}
            severity="success"
            style={{
              padding: "10px",
              margin: "0",
              gap: "10px",
              textAlign: "center",
              fontSize: "16px",
              width: "220px",
            }}
          />
        </div>

        <DataTable value={employees} style={{ width: "90%" }}>
          <Column
            field="id"
            header="ID"
            style={{ padding: "10px", maxWidth: "20px" }}
          />
          <Column
            field="cpf"
            header="CPF"
            style={{ padding: "10px", textAlign: "center" }}
            alignHeader={"center"}
          />
          <Column
            field="name"
            header="Nome"
            style={{ padding: "10px", maxWidth: "130px" }}
          />
          <Column
            field="position"
            header="Cargo"
            style={{ padding: "10px", maxWidth: "130px" }}
          />
          <Column
            field="salary"
            header="Salário"
            style={{ padding: "10px", textAlign: "center" }}
            alignHeader={"center"}
          />
          <Column
            field="workload"
            header="Carga Horária"
            alignHeader={"center"}
            style={{ padding: "10px", maxWidth: "80px", textAlign: "center" }}
          />
          <Column
            body={(rowData) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  label="Editar"
                  icon="pi pi-pencil"
                  onClick={() => handleEditEmployee(rowData)}
                  style={{
                    padding: "5px 10px",
                    margin: "0",
                    gap: "10px",
                    textAlign: "center",
                  }}
                />
              </div>
            )}
            alignHeader={"center"}
            header="Ação"
            style={{ padding: "10px" }}
          />
        </DataTable>
      </div>
      <Sidebar
        visible={showSidebar}
        position="right"
        style={{ width: "30rem", padding: "1rem 1rem" }}
        onHide={() => {
          setShowSidebar(false);
          setValidateInputs({});
        }}
      >
        <div
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "1rem" }}
        >
          Editar funcionário
        </div>

        {editedEmployee && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{ display: "flex", gap: "5px", flexDirection: "column" }}
            >
              <input
                type="text"
                value={editedEmployee.name}
                onChange={(e) =>
                  setEditedEmployee({ ...editedEmployee, name: e.target.value })
                }
                placeholder="Nome"
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  padding: "0.5rem",
                  border: "2px solid #ccc",
                }}
              />
              {validateInputs.name && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    padding: "0",
                    marginLeft: "10px",
                  }}
                >
                  {validateInputs.name}
                </div>
              )}
            </div>

            <div
              style={{ display: "flex", gap: "5px", flexDirection: "column" }}
            >
              <input
                type="text"
                value={editedEmployee.cpf}
                onChange={(e) => {
                  const masked = formatCpf(e.target.value);
                  setEditedEmployee({ ...editedEmployee, cpf: masked });
                }}
                placeholder="CPF"
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  border: "2px solid #ccc",
                }}
              />
              {validateInputs.cpf && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    padding: "0",
                    marginLeft: "10px",
                  }}
                >
                  {validateInputs.cpf}
                </div>
              )}
            </div>

            <div
              style={{ display: "flex", gap: "5px", flexDirection: "column" }}
            >
              <input
                type="text"
                value={editedEmployee.position}
                onChange={(e) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    position: e.target.value,
                  })
                }
                placeholder="Cargo"
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  border: "2px solid #ccc",
                }}
              />
              {validateInputs.position && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    padding: "0",
                    marginLeft: "10px",
                  }}
                >
                  {validateInputs.position}
                </div>
              )}
            </div>

            <div
              style={{ display: "flex", gap: "5px", flexDirection: "column" }}
            >
              <input
                type="number"
                value={editedEmployee.salary}
                onChange={(e) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    salary: parseFloat(e.target.value),
                  })
                }
                placeholder="Salário"
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  border: "2px solid #ccc",
                }}
              />
              {validateInputs.salary && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    padding: "0",
                    marginLeft: "10px",
                  }}
                >
                  {validateInputs.salary}
                </div>
              )}
            </div>

            <div
              style={{ display: "flex", gap: "5px", flexDirection: "column" }}
            >
              <input
                type="number"
                value={editedEmployee.workload}
                onChange={(e) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    workload: parseInt(e.target.value),
                  })
                }
                placeholder="Carga Horária"
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  border: "2px solid #ccc",
                }}
              />
              {validateInputs.workload && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    padding: "0",
                    marginLeft: "10px",
                  }}
                >
                  {validateInputs.workload}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Button
                label={creating ? "Cancelar" : "Excluir funcionário"}
                onClick={() => {
                  if (creating) {
                    setShowSidebar(false);
                    setValidateInputs({});
                  } else {
                    handleDeleteEmployee();
                  }
                }}
                severity="danger"
                style={{
                  padding: "5px 10px",
                  margin: "0",
                  gap: "10px",
                  textAlign: "center",
                  width: "50%",
                }}
              />
              <Button
                label={creating ? "Adicionar" : "Salvar"}
                onClick={creating ? handleCreateEmployee : handleSaveEmployee}
                style={{
                  padding: "5px 10px",
                  margin: "0",
                  gap: "10px",
                  textAlign: "center",
                  width: "50%",
                }}
              />
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Table;
