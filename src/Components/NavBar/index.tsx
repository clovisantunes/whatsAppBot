import React from 'react';
import { HiHome, HiCog, HiChartBar } from 'react-icons/hi';
import './style.css';

type NavBarProps = {
  onNavClick: (component: string) => void;
  activeComponent: string;
};

export default function NavBar({ onNavClick, activeComponent }: NavBarProps) {
  const menuItems = [
    { id: 'inicio', label: 'Início', icon: HiHome },
    { id: 'function', label: 'Configurações', icon: HiCog },
    { id: 'status', label: 'Status', icon: HiChartBar }
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Navegação principal">
      <div className="navbar__container">
        <div className="navbar__brand">
          <span className="navbar__logo">WhatsApp</span>
          <span className="navbar__sublogo">Business</span>
        </div>
        
        <div className="navbar__menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`navbar__item ${
                  activeComponent === item.id ? 'navbar__item--active' : ''
                }`}
                onClick={() => onNavClick(item.id)}
                aria-current={activeComponent === item.id ? 'page' : undefined}
              >
                <Icon className="navbar__icon" />
                <span className="navbar__label">{item.label}</span>
                <div className="navbar__indicator" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}