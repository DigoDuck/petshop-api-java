import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {currentYear} PetShop Digital. Todos os direitos reservados.
      </p>
      <nav>
        <Link to="/about">Sobre Nós</Link>
        <a
          href="https://github.com/DigoDuck/petshop-api-java"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub do Projeto
        </a>
      </nav>
    </footer>
  );
};

export default Footer;