# 💼 CRUD de Gestão de Funcionários

Este é um projeto fullstack de gerenciamento de funcionários. Ele inclui uma interface frontend moderna com React e um backend robusto com Quarkus e Java, conectados a um banco de dados MySQL.

---

## 🚀 Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca para construção de interfaces reativas
- **TypeScript**: Superset do JavaScript com tipagem estática
- **PrimeReact**: Conjunto de componentes UI responsivos e acessíveis
- **Axios**: Cliente HTTP para comunicação com a API
- **React Toastify**: Biblioteca para exibição de mensagens toast (feedback visual)
- **Vite**: Ferramenta para empacotamento e desenvolvimento rápido

### Backend

- **Java 17**: Linguagem de programação moderna e versátil
- **Quarkus**: Framework Java voltado a performance e cloud-native
- **Jakarta REST (JAX-RS)**: Para criação de APIs RESTful
- **Hibernate ORM com Panache**: ORM simplificado para persistência com JPA

### Banco de Dados

- **MySQL**: Banco de dados relacional
- **MySQL Workbench**: Interface visual opcional para administração do banco

---

## ⚙️ Requisitos para Executar Localmente

### Backend

- **Java 17** ou superior
- **Maven 3.8.6 ou superior** instalado  
  ⚠️ _Versões mais antigas, como 3.6.3, não são compatíveis com o Quarkus 3.21+_
- **Quarkus 3.21+**
- **MySQL Server** rodando localmente (porta 3306 por padrão)
- Banco de dados `company` criado manualmente ou via MySQL Workbench

> 💡 **Dica:** se você usar o `./mvnw` incluso no projeto, certifique-se de que o wrapper está configurado para baixar o Maven 3.8.6 ou superior.  
> Caso contrário, é recomendado **remover os arquivos `mvnw` e `.mvn/`** e rodar diretamente com:
>
> ```bash
> mvn quarkus:dev
> ```

### Frontend

- Node.js (v18 ou superior)
- npm ou yarn para gerenciamento de dependências

---

## 📁 Estrutura do Projeto

```
crud-funcionarios/
├── backend/     # Projeto Quarkus (API Java)
├── frontend/    # Projeto React + TypeScript
```

---

## 🔧 Como Rodar o Projeto Localmente

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

### 2. Configure o Banco de Dados

No seu MySQL (pode usar o Workbench ou terminal), crie o banco:

```sql
CREATE DATABASE company;
```

O Quarkus irá criar as tabelas automaticamente na primeira execução.

### 3. Backend (API com Quarkus)

```bash
cd backend
./mvnw quarkus:dev
```

A API estará disponível em `http://localhost:8080/employees`

### 4. Frontend (Interface com React)

```bash
cd ../frontend
npm install
npm run dev
```

O sistema estará acessível em `http://localhost:5173`

---

## ✅ Funcionalidades do Sistema

- 📋 Listagem de funcionários cadastrados
- ✏️ Edição de dados com validações
- ➕ Cadastro de novos funcionários
- 🗑️ Exclusão de funcionários
- ✅ Validação completa de campos (campos obrigatórios, CPF, valores positivos)
- 🔔 Feedback visual com toasts

---

## 🧪 Sugestões de Testes

- Tente adicionar um CPF que já está cadastrado (deve retornar erro do backend)
- Tente salvar sem preencher todos os campos obrigatórios
- Informe valores negativos em "salário" ou "carga horária" (deve bloquear)
- Teste a edição e observe o toast de sucesso
- Apague um registro e veja a atualização da tabela em tempo real

---
