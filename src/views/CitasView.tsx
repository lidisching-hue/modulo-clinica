import { useState, useEffect } from 'react';
import { ChevronLeft, Delete, Search, User, Calendar, MapPin, X, Navigation } from 'lucide-react';
import { hablar } from '../utils/voz';

interface Props {
  onNavigate: (pantalla: string, params?: any) => void;
  comandoVoz: string;
  limpiarComando: () => void;
  // ✅ Agregamos enviarComandoIA para solucionar el error de TypeScript
  enviarComandoIA: (mensaje: string) => void; 
}

// ✅ Recibimos enviarComandoIA en los parámetros del componente
export default function CitasView({ onNavigate, comandoVoz, limpiarComando, enviarComandoIA }: Props) {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState<'esperando' | 'buscando' | 'encontrado' | 'error'>('esperando');

  useEffect(() => {
    hablar("Estás en el apartado de citas. Dime tu número de DNI o digítalo en pantalla.");
  }, []);

  useEffect(() => {
    if (!comandoVoz) return;

    if (comandoVoz.includes('borrar')) {
      handleDelete();
      limpiarComando();
      return;
    }

    if (comandoVoz.includes('buscar') && dni.length === 8) {
      handleSearch();
      limpiarComando();
      return;
    }

    const numerosEnAudio = comandoVoz.replace(/\D/g, '');
    if (numerosEnAudio.length > 0) {
      setDni(prev => {
        const nuevoDni = (prev + numerosEnAudio).slice(0, 8);
        if (nuevoDni.length === 8 && prev.length !== 8) {
           hablar("DNI completo. Di la palabra Buscar o presiona el botón.");
        }
        return nuevoDni;
      });
      limpiarComando();
    }
  }, [comandoVoz]);

  const handleKeyPress = (num: string) => {
    if (dni.length < 8) {
      setDni(dni + num);
      hablar(num); 
      if (resultado !== 'esperando') setResultado('esperando');
    }
  };

  const handleDelete = () => {
    setDni(dni.slice(0, -1));
    hablar("Borrar");
  };

  const handleSearch = () => {
    if (dni.length === 8) {
      setResultado('buscando');
      hablar(`Buscando cita...`);
      
      // ✅ Enviamos el comando a la IA (Avatar Unith) para que procese la búsqueda
      enviarComandoIA(`BUSCAR SI TENGO UNA CITA ${dni}`);
      
      setTimeout(() => {
        if (dni === '12345678') {
          setResultado('encontrado');
          hablar("Cita encontrada. Tienes una cita con el Doctor Luis Sánchez en Pediatría. Presiona el botón verde o di 'abrir mapa' para ver cómo llegar.");
        } else {
          setResultado('error');
          hablar("Lo siento, no se encontraron citas para este documento.");
        }
      }, 1500);
    } else {
      hablar("Por favor, ingresa los 8 dígitos.");
    }
  };

  const irAMapa = () => {
    onNavigate('mapa', { destinoId: 'C-02' }); 
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden animate-in fade-in">
      <button onClick={() => onNavigate('inicio')} className="p-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors text-xl font-bold">
        <ChevronLeft size={28} className="mr-2" /> Volver al inicio
      </button>

      <div className="flex-1 flex px-8 pb-8 gap-8">
        <div className="w-1/2 flex flex-col justify-center border-r-2 border-slate-200 pr-8">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Consulta de Citas</h2>
          <p className="text-lg text-slate-500 mb-6">Ingresa o dicta tu DNI</p>
          
          <div className="bg-white border-b-4 border-blue-600 text-4xl font-mono p-4 w-full rounded-t-xl mb-6 flex justify-center tracking-[0.4em] text-slate-700 shadow-sm h-20 items-center">
            {dni || <span className="text-slate-300">--------</span>}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button key={n} onClick={() => handleKeyPress(n.toString())} className="bg-white border-2 border-slate-100 p-6 rounded-2xl text-3xl font-bold text-slate-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all">
                {n}
              </button>
            ))}
            <button onClick={handleDelete} className="bg-red-50 border-2 border-red-100 text-red-500 p-6 rounded-2xl flex justify-center items-center active:scale-95 transition-all hover:bg-red-100">
              <Delete size={32} />
            </button>
            <button onClick={() => handleKeyPress('0')} className="bg-white border-2 border-slate-100 p-6 rounded-2xl text-3xl font-bold text-slate-700 active:scale-95 shadow-sm hover:border-blue-400">
              0
            </button>
            <button onClick={handleSearch} disabled={dni.length !== 8} className={`p-6 rounded-2xl text-xl font-bold shadow-sm flex items-center justify-center transition-all ${dni.length === 8 ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              <Search size={28} />
            </button>
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center pl-4">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 h-[500px] flex flex-col p-8 w-full relative overflow-hidden">
            {resultado === 'esperando' && (
              <div className="m-auto text-center text-slate-400">
                <Search size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">Digita tu DNI y presiona buscar</p>
              </div>
            )}
            {resultado === 'buscando' && (
              <div className="m-auto text-center text-blue-500 animate-pulse">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-bold">Buscando en el sistema...</p>
              </div>
            )}
            {resultado === 'encontrado' && (
              <div className="animate-in slide-in-from-right-8 h-full flex flex-col justify-between">
                <div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg inline-flex font-bold mb-6">✓ Cita Confirmada</div>
                    <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600"><User size={28} /></div>
                        <div>
                        <p className="text-sm text-slate-500 font-bold uppercase">Especialista</p>
                        <p className="text-2xl font-bold text-slate-800">Dr. Luis Sánchez</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div className="bg-orange-50 p-3 rounded-full text-orange-600"><MapPin size={28} /></div>
                        <div>
                        <p className="text-sm text-slate-500 font-bold uppercase">Área / Consultorio</p>
                        <p className="text-2xl font-bold text-slate-800">Pediatría - C-02</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-full text-purple-600"><Calendar size={28} /></div>
                        <div>
                        <p className="text-sm text-slate-500 font-bold uppercase">Fecha y Hora</p>
                        <p className="text-2xl font-bold text-slate-800">Hoy, 10:30 AM</p>
                        </div>
                    </div>
                    </div>
                </div>
                <button 
                  onClick={irAMapa}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 text-lg"
                >
                  <Navigation size={24} /> Ver cómo llegar en el mapa
                </button>
              </div>
            )}
            {resultado === 'error' && (
              <div className="m-auto text-center text-slate-700 animate-in slide-in-from-right-8">
                <div className="bg-red-100 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">No hay citas</h3>
                <p className="text-lg text-slate-500">No encontramos registros para el DNI {dni}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}