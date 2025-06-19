import React from "react";

/**
 * Um componente de Card reutilizável.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children O conteúdo a ser renderizado dentro do card.
 * @param {string} [props.className] Classes CSS adicionais para o card.
 * @param {() => void} [props.onClick] 
 */
const Card = ({ children, className = "", onClick }) => {
  const cardClassName = `card ${className} ${onClick ? "cursor-pointer" : ""}`;

  return (
    <div className={cardClassName} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
