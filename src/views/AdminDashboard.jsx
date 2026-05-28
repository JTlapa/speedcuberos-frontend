import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ onLogout }) {
  const [categories, setCategories] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [newCategory, setNewCategory] = useState({ nombre: '', descripcion: '' });
  const [newRecord, setNewRecord] = useState({
    nombre_completo: '', edad: '', pais: '', red_social: '',
    tiempo_segundos: '', nombre_competencia: '', lugar_competencia: '', fecha_registro: new Date().toISOString().split('T')[0]
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchRecordsByCategory(selectedCategory);
    } else {
      setRecords([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      console.log('Categorías obtenidas:', res.data);
      setCategories(res.data);
      if (res.data.length > 0 && !selectedCategory) {
        setSelectedCategory(res.data[0].id_categoria);
      }
    } catch (err) {
      console.error('Error al traer categorías:', err);
    }
  };

  const fetchRecordsByCategory = async (catId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/records/categories/${catId}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error al traer récords:', err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!newCategory.nombre) {
      setError('Nombre es obligatorio.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/categories`, {
        nombre_cubo: newCategory.nombre,
        descripcion: newCategory.descripcion
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Categoría añadida exitosamente.');
      setNewCategory({ nombre: '', descripcion: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la categoría.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newRecord.nombre_completo || !newRecord.edad || !newRecord.pais || !newRecord.tiempo_segundos || !newRecord.nombre_competencia || !newRecord.lugar_competencia) {
      setError('Por favor, llena todos los campos obligatorios del competidor, el tiempo y la competencia.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const competitorResponse = await axios.post(`${API_BASE_URL}/competitors`, {
        nombre_completo: newRecord.nombre_completo,
        edad: Number(newRecord.edad),
        pais: newRecord.pais,
        red_social: newRecord.red_social || null
      }, config);

      const nuevoCompetidorId = competitorResponse.data.competitorId;

      if (!nuevoCompetidorId) {
        throw new Error('No se pudo recuperar el ID del competidor creado.');
      }

      await axios.post(`${API_BASE_URL}/records`, {
        id_competidor: Number(nuevoCompetidorId),
        id_categoria: Number(selectedCategory),
        tiempo_segundos: Number(newRecord.tiempo_segundos),
        nombre_competencia: newRecord.nombre_competencia,
        lugar_competencia: newRecord.lugar_competencia,  
        fecha: newRecord.fecha_registro
      }, config);

      setSuccess('¡Excelente! El competidor fue inscrito y su récord se asignó correctamente.');

      setNewRecord({
        nombre_completo: '', edad: '', pais: '', red_social: '', tiempo_segundos: '',
        nombre_competencia: '', lugar_competencia: '',
        fecha_registro: new Date().toISOString().split('T')[0]
      });

      fetchRecordsByCategory(selectedCategory);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al registrar el récord.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (idRecord) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro permanentemente de la plataforma?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/records/${idRecord}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Registro eliminado de la base de datos.');
      fetchRecordsByCategory(selectedCategory);
    } catch (err) {
      setError('No se pudo eliminar el récord.');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-white font-sans flex flex-col justify-between">
      <nav className="bg-brand-dark px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-black tracking-wider uppercase text-white">SpeedCuber OS </span>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
        >
          Cerrar sesión
        </button>
      </nav>

      <div className="max-w-7xl w-full mx-auto px-6 mt-4">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg font-medium"> {error}</div>}
        {success && <div className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs p-3 rounded-lg font-medium"> {success}</div>}
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">

        <div className="space-y-6 lg:col-span-1">
          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black tracking-widest text-brand-accent uppercase">Nueva Categoría</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Nombre del cubo</label>
                <input
                  type="text"
                  value={newCategory.nombre}
                  onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
                  placeholder="Ej. 3x3x3"
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Descripción <span className="text-gray-600">(Opcional)</span></label>
                <textarea
                  value={newCategory.descripcion}
                  onChange={(e) => setNewCategory({ ...newCategory, descripcion: e.target.value })}
                  placeholder="Detalles breve del cubo."
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent h-16 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent text-brand-dark font-black text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                {loading ? 'Creando...' : 'Añadir Categoría'}
              </button>
            </form>
          </div>

          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3 mt-44">
            <h3 className="text-sm font-black tracking-widest text-gray-300 uppercase">Categorías actuales</h3>
            <p className="text-[11px] text-gray-400">Selecciona una categoría y administrar sus récords globales correspondientes:</p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-gray-700 rounded-lg p-2.5 text-xs text-brand-accent font-bold focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_cubo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2 flex flex-col justify-between">

          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black tracking-widest text-brand-accent uppercase">Registrar Récord</h3>

            <form onSubmit={handleCreateRecord} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Categoría del Récord</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-brand-accent font-bold focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_cubo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Nombre del Competidor</label>
                <input
                  type="text"
                  value={newRecord.nombre_completo}
                  onChange={(e) => setNewRecord({ ...newRecord, nombre_completo: e.target.value })}
                  placeholder="Nombre Completo"
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Tiempo Oficial (Segundos)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newRecord.tiempo_segundos}
                  onChange={(e) => setNewRecord({ ...newRecord, tiempo_segundos: e.target.value })}
                  placeholder="Ej. 3.47"
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent font-mono text-brand-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Edad</label>
                  <input
                    type="number"
                    value={newRecord.edad}
                    onChange={(e) => setNewRecord({ ...newRecord, edad: e.target.value })}
                    placeholder="21"
                    className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">País</label>
                  <input
                    type="text"
                    value={newRecord.pais}
                    onChange={(e) => setNewRecord({ ...newRecord, pais: e.target.value })}
                    placeholder="China"
                    className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Red Social <span className="text-gray-600">(Opcional)</span></label>
                <input
                  type="text"
                  value={newRecord.red_social}
                  onChange={(e) => setNewRecord({ ...newRecord, red_social: e.target.value })}
                  placeholder="Ej. @cubemaster123"
                  className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Nombre de la Competencia</label>
                  <input
                    type="text"
                    value={newRecord.nombre_competencia}
                    onChange={(e) => setNewRecord({ ...newRecord, nombre_competencia: e.target.value })}
                    placeholder="Ej. Tlapa Open 2026"
                    className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Lugar</label>
                  <input
                    type="text"
                    value={newRecord.lugar_competencia}
                    onChange={(e) => setNewRecord({ ...newRecord, lugar_competencia: e.target.value })}
                    placeholder="Ej. Veracruz, Mexico"
                    className="w-full bg-slate-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-brand-dark font-black text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-brand-accent transition-colors cursor-pointer"
                >
                  {loading ? 'Insertando en BD...' : 'Guardar Récord'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3 flex-grow mt-6">
            <h3 className="text-sm font-black tracking-widest text-gray-300 uppercase">Récords actuales</h3>

            <div className="overflow-x-auto border border-gray-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-gray-800 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    <th className="p-3">Competidor</th>
                    <th className="p-3">País</th>
                    <th className="p-3 text-center">Tiempo</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-800/50">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500 font-medium">No existen récords registrados en esta categoría aún.</td>
                    </tr>
                  ) : (
                    records.map((rec) => (
                      <tr key={rec.id_record} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 font-bold text-white">{rec.competidor_nombre} <span className="text-[10px] text-gray-500 font-normal">({rec.edad} años)</span></td>
                        <td className="p-3 text-gray-300">{rec.pais}</td>
                        <td className="p-3 text-center font-mono font-bold text-brand-accent">{Number(rec.tiempo_segundos).toFixed(2)}s</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteRecord(rec.id_record)}
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-brand-dark text-gray-500 py-4 text-center text-[11px] border-t border-gray-800 mt-6">
        <p>© {new Date().getFullYear()} SpeedCuber OS Panel de Control Privado.</p>
      </footer>
    </div>
  );
}