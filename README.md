# Petshop Full-Stack (API + Interface)

## 📖 Sobre o Projeto

Este é um sistema web full-stack completo para a gestão de um petshop, desenvolvido como um projeto acadêmico. A aplicação inclui uma API RESTful robusta construída com **Spring Boot** e um front-end moderno e reativo construído com **React**.

O sistema permite que clientes gerenciem seus pets, agendem serviços e comprem produtos, enquanto administradores têm controle total sobre o inventário, pedidos e agendamentos. A segurança é garantida por um sistema de autenticação e autorização baseado em **Tokens JWT**.

## ✨ Funcionalidades Principais

### Para Clientes
-   Cadastro e Login de usuários.
-   Visualização de produtos com paginação.
-   Gerenciamento de Pets (Adicionar, Visualizar, Remover).
-   Sistema de Carrinho de Compras com estado global e persistência local.
-   Criação e visualização do histórico de Pedidos.
-   Agendamento e cancelamento de serviços para seus pets.

### Para Administradores
-   Acesso a rotas e funcionalidades protegidas por permissão (`ROLE_ADMIN`).
-   CRUD completo de Produtos e Categorias.
-   Visualização de todos os pedidos e agendamentos do sistema.
-   Capacidade de alterar o status de qualquer pedido (ex: PROCESSANDO -> ENVIADO).

## 🛠️ Tecnologias Utilizadas

| Camada    | Tecnologias                                                               |
| :-------- | :------------------------------------------------------------------------ |
| **Back-end** | Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Maven, MySQL |
| **Front-end** | React 18, Vite, React Router, Axios, Context API, Bootstrap 5             |
| **DevOps** | Docker, Docker Compose (opcional)                                         |

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar a aplicação completa em seu ambiente local.

### Pré-requisitos

* **Java JDK** (versão 17 ou superior)
* **Maven** (para gerenciar as dependências do back-end)
* **Node.js e npm** (para gerenciar as dependências do front-end)
* Um SGBD **MySQL** rodando localmente.

### 1. Configuração do Back-end (API)

Primeiro, vamos iniciar o servidor da API.

1.  **Configure o Banco de Dados:**
    * Navegue até a pasta do back-end: `cd petshop-api`
    * Abra o arquivo `src/main/resources/application.properties`.
    * Ajuste as seguintes linhas para corresponderem à sua configuração local do MySQL:
        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/petshop_db?createDatabaseIfNotExist=true
        spring.datasource.username=seu_usuario_mysql
        spring.datasource.password=sua_senha_mysql
        ```

2.  **Inicie a Aplicação:**
    * Ainda no terminal, dentro da pasta `petshop-api`, execute o comando Maven:
        ```bash
        mvn spring-boot:run
        ```
    * A API estará rodando em `http://localhost:8082`.

### 2. Configuração do Front-end (Interface)

Agora, vamos iniciar a interface React.

1.  **Abra um NOVO terminal.**
2.  **Navegue até a pasta do front-end:**
    ```bash
    cd petshop-frontend
    ```
3.  **Instale as dependências** (só precisa fazer isso na primeira vez):
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
5.  Abra seu navegador e acesse `http://localhost:3000` (ou a porta indicada no terminal).

### 🔑 Credenciais de Acesso

Para testar as funcionalidades de administrador, você precisará de um usuário com o tipo `ADMIN`. Certifique-se de que você tenha um usuário assim no seu banco de dados.

---
