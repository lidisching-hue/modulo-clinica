import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Clock, Map, DoorOpen, DoorClosed } from 'lucide-react';
import { hablar } from '../utils/voz';

interface Props {
  onNavigate: (pantalla: string, params?: any) => void;
  comandoVoz: string;
  limpiarComando: () => void;
}

const DOCTORES_DB = [
  { id: 1, nombre: "Dr. Carlos Ruiz", especialidad: "Medicina General", sala: "C-01", horario: "08:00 AM - 02:00 PM", estado: "abierto" },
  { id: 2, nombre: "Dra. Ana Gómez", especialidad: "Cardiología", sala: "C-65", horario: "10:00 AM - 06:00 PM", estado: "cerrado" },
  { id: 3, nombre: "Dr. Luis Sánchez", especialidad: "Pediatría", sala: "C-02", horario: "09:00 AM - 01:00 PM", estado: "abierto" },
  { id: 4, nombre: "Dra. María Torres", especialidad: "Dermatología", sala: "C-06", horario: "03:00 PM - 08:00 PM", estado: "cerrado" },
];

export default function MedicosView({ onNavigate, comandoVoz, limpiarComando }: Props) {
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    hablar("Directorio activo. Di buscar seguido de la especialidad, por ejemplo: buscar pediatría.");
  }, []);

  useEffect(() => {
    if (!comandoVoz) return;

    if (comandoVoz.includes("buscar")) {
      const textoBuscado = comandoVoz.replace("buscar", "").trim();
      setBusqueda(textoBuscado);
      hablar(`Buscando ${textoBuscado}`);
      limpiarComando();
    }
  }, [comandoVoz]);

  const doctoresFiltrados = DOCTORES_DB.filter(doc => 
    doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    doc.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  const irAMapa = (doctor: typeof DOCTORES_DB[0]) => {
    hablar(`Mostrando ruta hacia el consultorio de ${doctor.nombre}`);
    onNavigate('mapa', { destinoId: doctor.sala });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden animate-in fade-in">
      <button onClick={() => onNavigate('inicio')} className="p-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors text-xl font-bold shrink-0">
        <ChevronLeft size={28} className="mr-2" /> Volver al inicio
      </button>

      <div className="px-10 pb-10 flex flex-col h-full">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-6 tracking-tight">Directorio Médico</h2>
        
        <div className="flex gap-4 mb-8 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={28} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o especialidad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-6 pl-16 pr-6 text-xl text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-4">
          {doctoresFiltrados.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p className="text-2xl">No se encontraron especialistas.</p>
            </div>
          ) : (
            doctoresFiltrados.map(doc => (
              <div key={doc.id} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center gap-6 hover:border-blue-300 transition-colors">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-2xl shrink-0">
                  {doc.nombre.charAt(4)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-slate-800">{doc.nombre}</h3>
                    {doc.estado === 'abierto' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md"><DoorOpen size={14}/> ABIERTO</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md"><DoorClosed size={14}/> CERRADO</span>
                    )}
                  </div>
                  <p className="text-lg text-blue-600 font-medium">{doc.especialidad}</p>
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <Clock size={16} /> <span className="text-sm font-medium">{doc.horario}</span>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 text-center flex flex-col items-center">
                  <p className="text-sm font-bold text-slate-400 uppercase">Consultorio</p>
                  <p className="text-xl font-bold text-slate-700 mb-2">{doc.sala}</p>
                  <button 
                    onClick={() => irAMapa(doc)}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-200 transition-colors active:scale-95"
                  >
                    <Map size={18} /> Cómo llegar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}