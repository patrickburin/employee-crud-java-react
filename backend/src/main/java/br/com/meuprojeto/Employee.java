package br.com.meuprojeto;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.Column;

@Entity
public class Employee extends PanacheEntity {

    @Column(unique = true)
    @NotBlank(message = "O CPF é obrigatório")
    public String cpf;

    @NotBlank(message = "O nome é obrigatório")
    public String name;

    public String position;

    public Double salary;
    public Integer workload;
}
