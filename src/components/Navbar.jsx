import React from 'react';

export default function Navbar({ isAuthenticated, onLogout, onLoginClick }) {
  return (
    <nav className="bg-brand-dark text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold tracking-wide">Speed Cuber OS</span>
      </div>

      <div className="flex items-center space-x-6">
        
        {isAuthenticated ? (
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button className="bg-brand-accent hover:bg-emerald-500 text-brand-dark text-xs font-bold px-4 py-2 rounded transition-colors"
            onClick={onLoginClick}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}