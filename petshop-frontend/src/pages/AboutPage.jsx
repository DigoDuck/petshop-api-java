import styled from "styled-components";
// Supondo que você crie um diagrama e salve em 'src/assets/images/'

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--cor-fundo-card);
  border-radius: var(--border-radius-padrao);
  box-shadow: var(--box-shadow-padrao);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--cor-primaria);
  border-bottom: 2px solid var(--cor-secundaria);
  padding-bottom: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;

const StackList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StackItem = styled.li`
  background-color: #f0f0f0;
  color: var(--cor-texto);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
`;

const ArchitectureImage = styled.img`
  max-width: 100%;
  margin-top: 1rem;
  border-radius: var(--border-radius-padrao);
  border: 1px solid var(--cor-borda);
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <SectionTitle>Nossa Missão</SectionTitle>
      <p>
        O Petshop Angels nasceu como um projeto de portfólio para demonstrar a
        criação de uma aplicação web completa, unindo um frontend moderno com um
        backend robusto. Nossa missão é oferecer uma plataforma digital onde
        usuários podem gerenciar seus pets, agendar serviços e comprar produtos
        de forma intuitiva e eficiente.
      </p>

      <SectionTitle>Stack Técnica</SectionTitle>
      <p>Este projeto foi construído com as seguintes tecnologias:</p>
      <StackList>
        <StackItem>React (Frontend)</StackItem>
        <StackItem>Spring Boot (Backend)</StackItem>
        <StackItem>Java</StackItem>
        <StackItem>PostgreSQL (Banco de Dados)</StackItem>
        <StackItem>JWT para Autenticação</StackItem>
        <StackItem>Styled-components</StackItem>
        <StackItem>CSS com Variáveis</StackItem>
      </StackList>

      <SectionTitle>Arquitetura do Projeto</SectionTitle>
      <p>
        A aplicação segue uma arquitetura cliente-servidor. O frontend em React
        consome uma API RESTful construída com Spring Boot. O Spring Boot, por
        sua vez, se comunica com um banco de dados PostgreSQL para persistir os
        dados. A autenticação é gerenciada via tokens JWT, garantindo a
        segurança das rotas.
      </p>
      {/* **Opcional, mas recomendado:**
        Crie um diagrama de arquitetura simples (pode ser no draw.io, Figma, etc.),
        exporte como PNG, salve na pasta 'src/assets/images/' e descomente o código abaixo.
      */}
      {/* <ArchitectureImage src={architectureDiagram} alt="Diagrama de arquitetura do sistema" /> */}
    </AboutContainer>
  );
};

export default AboutPage;
