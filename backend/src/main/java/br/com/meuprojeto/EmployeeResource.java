package br.com.meuprojeto;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmployeeResource {

    @GET
    public List<Employee> getAll() {
        return Employee.listAll();
    }

    @GET
    @Path("/search")
    public Response getEmployees(@QueryParam("id") Long id, 
                                 @QueryParam("cpf") String cpf, 
                                 @QueryParam("name") String name) {

        if (id != null) {
            Employee employee = Employee.findById(id);
            if (employee == null) {
                return Response.status(Response.Status.NOT_FOUND)
                               .entity("ID não encontrado " + id)
                               .build();
            }
            return Response.ok(employee).build();
        }

        if (cpf != null) {
            List<Employee> employees = Employee.find("cpf like ?1", "%" + cpf + "%").list();
            if (employees.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                               .entity("CPF não encontrado " + cpf)
                               .build();
            }
            return Response.ok(employees).build();
        }

        if (name != null) {
            List<Employee> employees = Employee.find("name like ?1", "%" + name + "%").list();
            if (employees.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                               .entity("Nome não encontrado " + name)
                               .build();
            }
            return Response.ok(employees).build();
        }

        return Response.ok(Employee.listAll()).build();
    }

    @POST
    @Transactional
    public Response createEmployee(Employee employee) {
        if (Employee.find("cpf", employee.cpf).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT)
                .entity("Este CPF já está cadastrado.")
                .build();
        }
        employee.id = null;
        employee.persist();
        return Response.status(Response.Status.CREATED).entity(employee).build();
    }

    @PATCH
    @Path("/{id}")
    @Transactional
    public Response patchEmployee(@PathParam("id") Long id, Employee partialEmployee) {
        Employee existingEmployee = Employee.findById(id);
        if (existingEmployee == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Não existe funcionário com o id " + id)
                .build();
        }
    
        if (partialEmployee.cpf != null) {
            Employee cpfExists = Employee.find("cpf", partialEmployee.cpf).firstResult();
            if (cpfExists != null && !cpfExists.id.equals(id)) {
                return Response.status(Response.Status.CONFLICT)
                    .entity("Este CPF já está cadastrado.")
                    .build();
            }
            existingEmployee.cpf = partialEmployee.cpf;
        }
    
        if (partialEmployee.name != null) {
            existingEmployee.name = partialEmployee.name;
        }
    
        if (partialEmployee.position != null) {
            existingEmployee.position = partialEmployee.position;
        }
    
        if (partialEmployee.salary != null) {
            existingEmployee.salary = partialEmployee.salary;
        }
        
        if (partialEmployee.workload != null) {
            existingEmployee.workload = partialEmployee.workload;
        }
    
        return Response.ok(existingEmployee).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteEmployee(@PathParam("id") Long id) {
        Employee employee = Employee.findById(id);
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Não existe funcionário com o id " + id)
                .build();
        }
    
        employee.delete();
        return Response.noContent().build();
    }
}
