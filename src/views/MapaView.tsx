import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Navigation, Info } from 'lucide-react';
import { hablar } from '../utils/voz'; 

interface Props {
  onNavigate: (pantalla: string, params?: any) => void;
  params?: any;
  comandoVoz: string;
  limpiarComando: () => void;
}

const ubicaciones = [
  { 
    id: "C-01", doctor: "Dr. Carlos Ruiz", especialidad: "Medicina General", consultorio: "C-01", 
    imagenLocal: "ruta-c01.jpg", 
    instrucciones: "Avanza recto por el pasillo principal. El C-01 está a tu izquierda, justo antes del Laboratorio."
  },
  { 
    id: "C-06", doctor: "Dra. María Torres", especialidad: "Dermatología", consultorio: "C-06", 
    imagenLocal: "ruta-c06.jpg", 
    instrucciones: "Avanza recto, pasa Farmacia. El C-06 es el último a tu derecha, antes del ascensor."
  },
  { 
    id: "C-03", doctor: "Dra. Elena Silva", especialidad: "Ginecología", consultorio: "C-03", 
    imagenLocal: "ruta-c03.jpg", 
    instrucciones: "Avanza recto por el pasillo principal. El C-03 está a tu derecha, justo antes de la Farmacia."
  },
  { 
    id: "C-02", doctor: "Dr. Luis Sánchez", especialidad: "Pediatría", consultorio: "C-02", 
    imagenLocal: "ruta-c02.jpg", 
    instrucciones: "Avanza por el pasillo central, el consultorio de Pediatría (C-02) está a tu izquierda."
  }
];

export default function MapaView({ onNavigate, params, comandoVoz, limpiarComando }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<any>(null);

  useEffect(() => {
    if (params && params.destinoId) {
      const destino = ubicaciones.find(u => u.id === params.destinoId);
      if (destino) seleccionarDestino(destino);
    } else {
      hablar("Mapa abierto. Di 'dónde está' seguido de un consultorio o especialidad.");
    }
  }, [params]);

  useEffect(() => {
    if (!comandoVoz) return;

    if (comandoVoz.includes("dónde está") || comandoVoz.includes("como llegar a")) {
      const objetivo = comandoVoz.replace("dónde está", "").replace("como llegar a", "").trim().toLowerCase();
      
      const hallado = ubicaciones.find(u => 
        u.especialidad.toLowerCase().includes(objetivo) || 
        u.consultorio.toLowerCase().includes(objetivo)
      );

      if (hallado) {
        seleccionarDestino(hallado);
      } else {
        hablar("No encontré ese destino en el mapa.");
      }
      limpiarComando();
    }
  }, [comandoVoz]);

  const seleccionarDestino = (destino: any) => {
    setDestinoSeleccionado(destino);
    hablar(`Mostrando ruta. ${destino.instrucciones}`);
  };

  const filtrarUbicaciones = ubicaciones.filter(ubi => 
    ubi.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
    ubi.doctor.toLowerCase().includes(busqueda.toLowerCase()) ||
    ubi.consultorio.includes(busqueda)
  );

  const imagenMostrar = destinoSeleccionado 
    ? `/mapas/${destinoSeleccionado.imagenLocal}` 
    : `/mapas/mapa-general.jpg`;

  return (
    <div className="flex-1 flex flex-col p-12 h-full bg-slate-50">
      <button 
        onClick={() => onNavigate('inicio')} 
        className="flex items-center gap-2 text-slate-500 mb-6 font-semibold w-fit active:scale-95 transition-transform hover:text-blue-600"
      >
        <ArrowLeft /> Volver al menú
      </button>

      <h2 className="text-4xl font-bold mb-8 text-slate-800">Ubicaciones y Rutas</h2>

      <div className="flex gap-8 flex-1 h-[calc(100%-120px)]">
        <div className="w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar especialidad o Dr..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 text-lg py-4 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
            {filtrarUbicaciones.map(ubi => (
              <button 
                key={ubi.id}
                onClick={() => seleccionarDestino(ubi)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${destinoSeleccionado?.id === ubi.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 shadow-sm'}`}
              >
                <h3 className="font-bold text-lg text-slate-800">{ubi.especialidad}</h3>
                <p className="text-slate-500 text-sm">{ubi.doctor}</p>
                <div className="mt-2 inline-block bg-slate-200 px-2 py-1 rounded-md text-xs font-bold text-slate-600">
                  Cons. {ubi.consultorio}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-white border-4 border-slate-200 rounded-3xl relative overflow-hidden flex flex-col shadow-lg">
          <div className="relative flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
            <img 
              src={imagenMostrar} 
              alt="Mapa de la Clínica" 
              className="w-full h-full object-contain animate-in fade-in duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x600.png?text=Falta+Imagen+Local";
              }}
            />
          </div>

          {destinoSeleccionado ? (
            <div className="bg-blue-600 text-white p-6 shadow-xl z-30 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-2">
                <Navigation className="text-blue-200" size={24} />
                <h4 className="font-bold text-xl">Ruta hacia {destinoSeleccionado.consultorio}</h4>
              </div>
              <p className="text-blue-50 leading-relaxed font-medium text-lg">
                {destinoSeleccionado.instrucciones}
              </p>
            </div>
          ) : (
            <div className="bg-slate-100 p-6 border-t border-slate-200 z-30 flex items-center gap-3 text-slate-500">
               <Info /> Selecciona un destino en la lista o pídelo por voz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}