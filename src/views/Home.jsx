import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecordsSection from '../components/RecordsSection';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  if (isAuthenticated && currentUser && currentUser.rol === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="bg-brand-bg min-h-screen font-sans flex flex-col justify-between">
      <div>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} onLoginClick={() => setShowLoginModal(true)}/>

        <header className="bg-brand-dark text-white py-14 px-6 text-center md:text-left">
          <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ¡Bienvenido a la plataforma oficial de registros Speed Cuber OS!
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base">
              {isAuthenticated 
                ? "Hola de nuevo, competidor. Revisa tus tiempos activos, rompe tus marcas personales y gestiona tus nuevos desafíos desde tu panel privado." 
                : "Te invitamos a unirte a nuestra comunidad internacional de speedcubing. Registra tus tiempos oficiales, compite en los rankings globales y mantén tu perfil actualizado."
              }
            </p>
            {!isAuthenticated && (
              <button onClick={() => setShowRegisterModal(true)} className="bg-brand-accent text-brand-dark font-bold text-xs px-6 py-3 rounded-full shadow hover:bg-emerald-500 transition-colors">
                Crear tu cuenta ahora
              </button>
            )}
          </div>
        </header>

        <main className="bg-brand-bg">
          <RecordsSection />
        </main>

        <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {isAuthenticated ? (
            <>
            <div className="bg-brand-dark text-white p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                <h3 className="text-xl font-bold text-brand-accent">Panel de Control de Tiempos</h3>
                <p className="text-sm text-gray-300 mt-2 max-w-md">Sube tus resoluciones grabadas o asóciate a una nueva competencia de la WCA.</p>
                <button className="bg-brand-accent text-brand-dark font-bold text-xs px-4 py-2 rounded mt-4 w-fit hover:bg-emerald-500 transition-colors">
                Subir Nuevo Récord
                </button>
            </div>
            <div className="bg-brand-accent text-brand-dark p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                <h3 className="text-xl font-bold">Estadísticas Avanzadas Activas</h3>
                <p className="text-sm font-medium mt-2 max-w-md">Tienes acceso al analizador de promedios (Ao5 y Ao12) de tus categorías preferidas.</p>
            </div>
            </>
        ) : (
            <>
            <div className="bg-brand-dark text-white p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-3">
                <h3 className="text-xl font-bold">Monitorea los récords globales</h3>
                <p className="text-xs text-gray-400 max-w-md">Todo el ecosistema de speedcubing centralizado en un solo lugar. Conéctate para reclamar tus marcas.</p>
                <div className="bg-brand-accent text-brand-dark h-2 w-16 rounded"></div>
            </div>
            <div className="bg-brand-accent text-brand-dark p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                <h3 className="text-2xl font-black uppercase tracking-tight">Únete a la Comunidad</h3>
                <p className="text-sm font-medium mt-1 max-w-md">Inicia sesión para desbloquear la carga de tus propios cronometrajes oficiales.</p>
                <div className="bg-brand-dark mt-2 text-brand-dark h-2 w-16 rounded"></div>
            </div>
            </>
        )}
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-brand-dark font-bold text-sm tracking-widest uppercase mb-6 text-center">
            Requisitos para Validar tus Retos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-dark text-white p-6 rounded-lg shadow-md border-t-4 border-brand-accent">
              <h4 className="font-bold text-base mb-4 text-brand-accent">1. Identidad Legal</h4>
              <ul className="text-xs space-y-2 text-gray-300">
                <li>- Tener una cuenta de usuario en la plataforma.</li>
                <li>- Nombre completo.</li>
              </ul>
            </div>
            <div className="bg-brand-accent text-brand-dark p-6 rounded-lg shadow-md transform md:scale-105">
              <h4 className="font-black text-base mb-4">2. Veracidad del Tiempo</h4>
              <ul className="text-xs space-y-2 font-medium">
                <li>- Subir el tiempo exacto en segundos.</li>
                <li>- Cronometraje realizado con un Timer verificado.</li>
              </ul>
            </div>
            <div className="bg-brand-dark text-white p-6 rounded-lg shadow-md border-t-4 border-brand-accent">
              <h4 className="font-bold text-base mb-4 text-brand-accent">3. Trayectoria WCA</h4>
              <ul className="text-xs space-y-2 text-gray-300">
                <li>- Haber asistido a mínimo una competencia oficial.</li>
                <li>- Proveer una red social activa de seguimiento.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-brand-dark text-gray-400 py-6 text-center text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} Speed Cuber OS. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="h-2 w-2 rounded-full bg-brand-accent"></div>
          <div className="h-2 w-2 rounded-full bg-brand-accent"></div>
          <div className="h-2 w-2 rounded-full bg-brand-accent"></div>
        </div>
      </footer>
      {showLoginModal && (
        <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLoginModal(false)} onSwitchToRegister={handleSwitchToRegister} />
      )}
      {showRegisterModal && (
        <Register onRegisterSuccess={() => { setShowRegisterModal(false); setShowLoginModal(true); }} 
          onCancel={() => setShowRegisterModal(false)} 
        />
      )}
    </div>
  );
}