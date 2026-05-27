import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecordsSection() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [topRecords, setTopRecords] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/api/categories')
            .then(res => {
                setCategories(res.data);
                if (res.data.length > 0) {
                    setSelectedCategory(res.data[0]);
                }
            })
            .catch(err => console.error("Error cargando categorías:", err));
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`http://localhost:5000/api/records/categories/${selectedCategory.id_categoria}/top3`)
                .then(res => setTopRecords(res.data))
                .catch(err => console.error("Error cargando podio:", err));
        }
    }, [selectedCategory]);

    const handleNext = () => {
        if (startIndex + 3 < categories.length) setStartIndex(startIndex + 1);
    };

    const handlePrev = () => {
        if (startIndex > 0) setStartIndex(startIndex - 1);
    };

    const visibleCategories = categories.slice(startIndex, startIndex + 3);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 px-6 max-w-7xl mx-auto">
            { }
            <div className="lg:col-span-2 flex flex-col justify-between">
                <div className="space-y-4">
                    <h2 className="text-brand-dark font-bold text-sm tracking-widest uppercase mb-2 border-b-2 border-brand-dark w-fit pb-1">
                        Categorías Disponibles
                    </h2>
                    {visibleCategories.map((cat) => (
                        <div
                            key={cat.id_categoria}
                            onClick={() => setSelectedCategory(cat)}
                            className={`p-6 rounded-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-1 shadow-md ${selectedCategory?.id_categoria === cat.id_categoria
                                    ? 'bg-brand-accent text-brand-dark font-semibold'
                                    : 'bg-brand-card-bg text-white'
                                }`}
                        >
                            <h3 className="text-xl font-bold">{cat.nombre_cubo}</h3>
                            <p className={`text-sm mt-2 ${selectedCategory?.id_categoria === cat.id_categoria ? 'text-brand-dark/80' : 'text-gray-300'}`}>
                                {cat.descripcion || 'Sin descripción disponible.'}
                            </p>
                        </div>
                    ))}
                </div>

                { }
                <div className="flex items-center justify-center space-x-3 mt-6">
                    <button onClick={handlePrev}
                        disabled={startIndex === 0}
                        className="text-brand-dark font-bold text-xl disabled:opacity-30 cursor-pointer"
                    >
                        &#8678;
                    </button>
                    {Array.from({ length: Math.ceil(categories.length - 2) }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-3 w-3 rounded-sm transition-colors ${startIndex === i ? 'bg-brand-accent' : 'bg-gray-400'}`}
                        ></div>
                    ))}
                    <button
                        onClick={handleNext}
                        disabled={startIndex + 3 >= categories.length}
                        className="text-brand-dark font-bold text-xl disabled:opacity-30 cursor-pointer"
                    >
                        &#8680;
                    </button>
                </div>
            </div>

            { }
            <div className="bg-transparent flex flex-col space-y-4">
                <h2 className="text-brand-dark font-bold text-sm tracking-widest uppercase mb-2 border-b-2 border-brand-dark w-fit pb-1">
                    Top 3 - {selectedCategory?.nombre_cubo || 'Cargando...'}
                </h2>

                {topRecords.length === 0 ? (
                    <p className="text-brand-dark text-sm italic">No hay récords registrados aún.</p>
                ) : (
                    topRecords.map((record, index) => (
                        <div key={record.id_record} className="bg-brand-card-bg text-white p-4 rounded-lg shadow flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                { }
                                <div className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold text-brand-dark ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300' : 'bg-amber-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{record.competidor_nombre}</h4>
                                    <p className="text-xs text-gray-400">{record.nombre_competencia}</p>
                                    <p className="text-xs text-gray-400">{record.edad} años</p>
                                    <p className="text-xs text-gray-400">{record.red_social}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-brand-accent font-mono font-bold text-lg">{record.tiempo_segundos}s</span>
                                <p className="text-[10px] text-gray-400">{new Date(record.fecha).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400">{record.pais}</p>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}