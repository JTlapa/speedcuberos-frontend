import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Register({ onRegisterSuccess, onCancel }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [pais, setPais] = useState('');
  const [redSocial, setRedSocial] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombreCompleto || !correo || !password || !edad || !pais) {
      setError('Todos los campos son obligatorios, excepto la red social.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        id_rol: 2,
        nombre_completo: nombreCompleto,
        correo,
        password,
        edad: Number(edad),
        pais,
        red_social: redSocial
      });

      if (response.status === 201) {
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        onRegisterSuccess(); 
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Error al conectar con el servidor. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-brand-dark w-full max-w-lg rounded-2xl shadow-2xl border border-gray-800 my-8 overflow-hidden flex flex-col justify-between">
        
        <div className="bg-brand-dark px-8 pt-6 pb-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] text-brand-accent font-mono font-bold tracking-widest uppercase">Speed Cuber OS</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">CREAR CUENTA DE COMPETIDOR</h2>
          <p className="text-xs text-gray-400 mt-0.5">Regístrate para empezar a subir tus marcas oficiales y competir en los rankings.</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="px-8 pb-6 space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Ej. Jesus Tlapa Hernandez" 
              className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Correo Electrónico</label>
              <input 
                type="email" 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@gmail.com" 
                className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm select-none grayscale hover:grayscale-0 transition-all"
                >
                                &#128065;
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Edad</label>
              <input 
                type="number" 
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="22" 
                className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">País</label>
              <input 
                type="text" 
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Mexico" 
                className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Red Social <span className="text-gray-500 lowercase">(opcional)</span></label>
              <input 
                type="text" 
                value={redSocial}
                onChange={(e) => setRedSocial(e.target.value)}
                placeholder="facebook.com/..." 
                className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <div 
              onClick={onCancel}
              className="w-1/2 bg-transparent text-gray-400 hover:text-white font-bold text-xs py-3 rounded-lg border border-gray-700 transition-colors cursor-pointer text-center select-none"
            >
              Cancelar
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-1/2 bg-brand-accent hover:bg-emerald-500 text-brand-dark font-black text-xs py-3 rounded-lg transition-all tracking-wider disabled:opacity-50 cursor-pointer text-center uppercase"
            >
              {loading ? 'Procesando...' : 'Registrarme'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}