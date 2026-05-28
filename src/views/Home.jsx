import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecordsSection from '../components/RecordsSection';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import { API_BASE_URL } from '../config';
import axios from 'axios';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [userRecords, setUserRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newRecord, setNewRecord] = useState({ tiempo_segundos: '', nombre_competencia: '', lugar_competencia: '', fecha: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${API_BASE_URL}/categories`)
        .then(res => {
          setCategories(res.data);
          if (res.data.length > 0) setSelectedCategory(res.data[0].id_categoria);
        }).catch(err => console.error(err));

      const token = localStorage.getItem('token');
      axios.get(`${API_BASE_URL}/records/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUserRecords(res.data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

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
  const handleUserCreateRecord = async (e) => {
    e.preventDefault();

    if (!newRecord.tiempo_segundos || !newRecord.nombre_competencia || !newRecord.lugar_competencia) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_BASE_URL}/records`, {
        id_categoria: Number(selectedCategory),
        tiempo_segundos: Number(newRecord.tiempo_segundos),
        nombre_competencia: newRecord.nombre_competencia,
        lugar_competencia: newRecord.lugar_competencia,
        fecha: newRecord.fecha
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201 || response.status === 200) {
        alert('Récord subido exitosamente.');
        setNewRecord({
          tiempo_segundos: '',
          nombre_competencia: '',
          lugar_competencia: '',
          fecha: new Date().toISOString().split('T')[0]
        });
        const resRecords = await axios.get(`${API_BASE_URL}/records/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserRecords(resRecords.data);
      }
    } catch (err) {
      console.error('Error al subir récord:', err);
      alert(err.response?.data?.message || 'Hubo un problema al guardar tu récord en el servidor.');
    }
  };
  return (
    <div className="bg-brand-bg min-h-screen font-sans flex flex-col justify-between">
      <div>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} onLoginClick={() => setShowLoginModal(true)} />

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
              <div className="bg-brand-dark text-white p-8 md:p-12 flex flex-col justify-center space-y-4 border-r border-gray-800">
                <div>
                  <h3 className="text-xl font-bold text-brand-accent uppercase tracking-tight">Panel de Control de Tiempos</h3>
                  <p className="text-xs text-gray-400 mt-1">Registra una nueva marca personal lograda en un torneo oficial.</p>
                </div>

                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" onSubmit={handleUserCreateRecord}>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Categoría del Cubo</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-900/80 border border-gray-700 rounded-lg p-2 text-xs text-brand-accent font-bold focus:outline-none focus:border-brand-accent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre_cubo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Tiempo (Segundos)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newRecord.tiempo_segundos}
                      onChange={(e) => setNewRecord({ ...newRecord, tiempo_segundos: e.target.value })}
                      placeholder="Ej. 5.24"
                      className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent font-mono text-brand-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Fecha del Registro</label>
                    <input
                      type="date"
                      value={newRecord.fecha}
                      onChange={(e) => setNewRecord({ ...newRecord, fecha: e.target.value })}
                      className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent text-gray-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Nombre de Competencia</label>
                    <input
                      type="text"
                      value={newRecord.nombre_competencia}
                      onChange={(e) => setNewRecord({ ...newRecord, nombre_competencia: e.target.value })}
                      placeholder="Ej. Veracruz Open 2026"
                      className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Lugar de Competencia</label>
                    <input
                      type="text"
                      value={newRecord.lugar_competencia}
                      onChange={(e) => setNewRecord({ ...newRecord, lugar_competencia: e.target.value })}
                      placeholder="Ej. Mexico"
                      className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="bg-brand-accent text-brand-dark font-black text-xs px-5 py-2.5 rounded-lg w-full sm:w-auto hover:bg-emerald-500 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Subir Récord
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-brand-accent text-brand-dark p-8 md:p-12 flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">Tus Marcas Históricas</h3>
                  <p className="text-xs font-medium text-brand-dark/80 mt-1">Lista completa de tus tiempos oficiales.</p>
                </div>

                <div className="max-h-[260px] overflow-y-auto pr-2 space-y-2.5 custom-scrollbar bg-brand-dark/5 p-3 rounded-xl border border-brand-dark/10">
                  {userRecords.length === 0 ? (
                    <p className="text-xs font-semibold text-center py-8 text-brand-dark/60">Aún no has registrado ningún tiempo. ¡Sube tu primera resolución!</p>
                  ) : (
                    userRecords.map((rec) => (
                      <div
                        key={rec.id_record}
                        className="bg-brand-dark text-white rounded-xl p-3 shadow-sm border border-gray-800 flex justify-between items-center transition-transform hover:scale-[1.01]"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold bg-brand-accent text-brand-dark px-1.5 py-0.5 rounded-sm uppercase">
                              {rec.nombre_cubo}
                            </span>
                            <span className="text-xs font-bold tracking-tight text-gray-200">
                              {rec.nombre_competencia}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400">
                            {rec.lugar_competencia} • <span className="font-mono">{new Date(rec.fecha).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <div className="text-right pl-4">
                          <span className="text-base font-mono font-black text-brand-accent">
                            {Number(rec.tiempo_segundos).toFixed(2)}s
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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