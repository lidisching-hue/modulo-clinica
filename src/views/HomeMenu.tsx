import { CalendarCheck, Stethoscope, Map } from 'lucide-react'
import { hablar } from '../utils/voz';

export default function HomeMenu({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const handleClick = (pantalla: string, mensaje: string) => {
    hablar(mensaje);
    onNavigate(pantalla);
  };

  return (
    <div className="flex-1 p-12 flex flex-col justify-center relative animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Clínica Del Dolor👨‍⚕️ 
        </h1>
        <p className="text-2xl text-slate-500">
          Toca una opción o simplemente di en voz alta: <br/>
          <span className="font-bold text-blue-600">"Tengo una cita"</span>, <span className="font-bold text-blue-600">"Buscar médico"</span> o <span className="font-bold text-blue-600">"Abrir mapa"</span>.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button onClick={() => handleClick('citas', 'Has seleccionado: Tengo una cita.')} className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-md hover:shadow-xl hover:border-blue-500 transition-all active:scale-95 border-2 border-transparent h-64">
          <div className="bg-blue-100 p-5 rounded-full mb-4 text-blue-600"><CalendarCheck size={64} /></div>
          <span className="text-3xl font-bold text-slate-700">Tengo una cita</span>
        </button>

        <button onClick={() => handleClick('medicos', 'Abriendo directorio médico.')} className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-md hover:shadow-xl hover:border-green-500 transition-all active:scale-95 border-2 border-transparent h-64">
          <div className="bg-green-100 p-5 rounded-full mb-4 text-green-600"><Stethoscope size={64} /></div>
          <span className="text-3xl font-bold text-slate-700">Buscar Médico</span>
        </button>

        <button onClick={() => handleClick('mapa', 'Abriendo el mapa interactivo.')} className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-md hover:shadow-xl hover:border-orange-500 transition-all active:scale-95 border-2 border-transparent h-64">
          <div className="bg-orange-100 p-5 rounded-full mb-4 text-orange-600"><Map size={64} /></div>
          <span className="text-3xl font-bold text-slate-700">Mapa</span>
        </button>
      </div>
    </div>
  );
}