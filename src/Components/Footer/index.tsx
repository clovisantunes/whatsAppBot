import React from "react";
import './style.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {currentYear} - Todos os direitos reservados</p>
        <p className="developer">Desenvolvido por Clovis Antunes</p>
      </div>
    </footer>
  );
}