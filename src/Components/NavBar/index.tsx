import React from 'react';
import './style.css';

export default function NavBar({ onNavClick }) {
  return (
    <nav className="navBar_Container">
      <div className="navBar_Menu">
        <a
          href="#inicio"
          className="navBar_Item"
          onClick={() => onNavClick('inicio')}
        >
          Inicio
        </a>
        <a
          href="#function"
          className="navBar_Item"
          onClick={() => onNavClick('function')}
        >
          Funções
        </a>
        <a
          href="#function"
          className="navBar_Item"
          onClick={() => onNavClick('status')}
        >
          Status
        </a>
      </div>
    </nav>
  );
}