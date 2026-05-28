import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Login({ onLoginSuccess, onCancel, onSwitchToRegister }) {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(false);

        if (!correo || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                correo,
                password
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                onLoginSuccess(user);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-brand-dark w-full max-w-md rounded-2xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col justify-between">

                <div className="bg-brand-dark px-8 pt-8 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-brand-accent font-mono font-bold tracking-widest uppercase">Speed Cuber OS</span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">INICIAR SESIÓN</h2>
                    <p className="text-xs text-gray-400 mt-1">Ingresa tus credenciales para acceder a tu panel de competidor.</p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" className="px-8 pb-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-lg font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Correo Electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="tu.usuario@speedcube.com"
                            className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-900/60 border border-gray-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-base select-none grayscale hover:grayscale-0 transition-all"
                            >
                                &#128065;
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-1/2 bg-transparent text-gray-400 hover:text-white font-bold text-xs py-3 rounded-lg border border-gray-700 transition-colors cursor-pointer text-center"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-brand-accent hover:bg-emerald-500 text-brand-dark font-black text-xs py-3 rounded-lg transition-all tracking-wider disabled:opacity-50 cursor-pointer text-center uppercase"
                        >
                            {loading ? 'Validando...' : 'Entrar'}
                        </button>
                    </div>
                </form>

                <div className="bg-slate-900/40 px-8 py-4 border-t border-gray-800/60 text-center">
                    <p className="text-[11px] text-gray-500">¿No tienes cuenta? <span onClick={onSwitchToRegister} className="text-brand-accent hover:underline cursor-pointer font-semibold">Regístrate aquí</span></p>
                </div>

            </div>
        </div>
    );
}