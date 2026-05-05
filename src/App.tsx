import { useState, useRef, useEffect } from 'react';
import HomeMenu from './views/HomeMenu';
import CitasView from './views/CitasView';
import MedicosView from './views/MedicosView';
import MapaView from './views/MapaView';
import { X, Mic, MicOff, Bot, Sparkles, Activity } from 'lucide-react';
import { hablar } from './utils/voz';
import { useReconocimientoVoz } from './hooks/useReconocimientoVoz';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('inicio');
  const [parametros, setParametros] = useState<any>(null); 
  const [mostrarIA, setMostrarIA] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { comandoVoz, limpiarComando, isListening, toggleListening } = useReconocimientoVoz();

  const URL_IA = "https://stream.unith.ai/ucv-1697/li-28379?api_key=7d031bb4eee241de97f8a235679d5c93";

  useEffect(() => {
    const bienvenida = () => {
      hablar("Bienvenido al Kiosko de MediGuide. Toca una opción o presiona el botón del micrófono para hablar.");
      window.removeEventListener('click', bienvenida);
    };
    
    window.addEventListener('click', bienvenida);
    return () => window.removeEventListener('click', bienvenida);
  }, []);

  // Lógica de Comandos Globales
  useEffect(() => {
    if (!comandoVoz) return;

    if (comandoVoz.includes("volver al inicio") || comandoVoz.includes("ir al menú")) {
      handleNavigate('inicio');
    } else if (comandoVoz.includes("abrir mapa") || comandoVoz.includes("ver el mapa")) {
      handleNavigate('mapa');
    } else if (comandoVoz.includes("buscar médico") || comandoVoz.includes("directorio")) {
      handleNavigate('medicos');
    } else if (comandoVoz.includes("tengo una cita") || comandoVoz.includes("buscar cita")) {
      handleNavigate('citas');
    } else if (comandoVoz.includes("conectar asistente") || comandoVoz.includes("hablar con inteligencia")) {
      handleNavigate('voz');
      limpiarComando();
    }
  }, [comandoVoz]);

  const enviarComandoIA = (mensaje: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "text_input", text: mensaje }, "*");
    }
  };

  const handleNavigate = (screen: string, params?: any) => {
    if (screen === 'inicio') {
      hablar("Volviendo al menú principal.");
      setCurrentScreen('inicio');
    } else if (screen === 'voz') {
      hablar("Conectando con tu asistente virtual.");
      setMostrarIA(true);
    } else {
      setCurrentScreen(screen);
    }
    
    setParametros(params || null);
    limpiarComando(); 
  };

  const cerrarIA = () => {
    hablar("Cerrando asistente virtual.");
    setMostrarIA(false);
  };

  return (
    <main className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      
      {/* --- LADO IZQUIERDO: Kiosko (60%) --- */}
      <section className="w-[60%] h-full bg-slate-50 flex flex-col relative shadow-[25px_0_50px_rgba(0,0,0,0.5)] z-10">
        
        {/* BOTÓN GLOBAL PUSH-TO-TALK REFACTORIZADO */}
        <button 
          type="button" 
          onClick={toggleListening}
          className={`absolute bottom-8 right-8 z-50 flex items-center gap-3 px-8 py-5 rounded-full shadow-2xl text-xl font-extrabold transition-all active:scale-95 border-4 ${
            isListening 
              ? 'bg-red-500 text-white border-red-300 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]' 
              : 'bg-blue-600 text-white border-blue-400 hover:bg-blue-500 hover:border-blue-300 shadow-[0_15px_30px_rgba(37,99,235,0.4)]'
          }`}
        >
          {/* Renderizamos el ícono de forma estable */}
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          
          {/* Envolvemos el texto en un span para que React no se confunda al actualizar el DOM */}
          <span>
            {isListening ? 'Procesando voz...' : 'Tocar para Hablar'}
          </span>
        </button>

        {currentScreen === 'inicio' && <HomeMenu onNavigate={handleNavigate} />}
        {currentScreen === 'citas' && (
          <CitasView 
            onNavigate={handleNavigate} 
            enviarComandoIA={enviarComandoIA} 
            comandoVoz={comandoVoz} 
            limpiarComando={limpiarComando} 
          />
        )}
        {currentScreen === 'medicos' && (
          <MedicosView 
            onNavigate={handleNavigate} 
            comandoVoz={comandoVoz} 
            limpiarComando={limpiarComando} 
          />
        )}
        {currentScreen === 'mapa' && (
          <MapaView 
            onNavigate={handleNavigate} 
            params={parametros} 
            comandoVoz={comandoVoz} 
            limpiarComando={limpiarComando} 
          />
        )}
      </section>

      {/* --- LADO DERECHO: Asistente Virtual Holográfico (40%) --- */}
      <section className="w-[40%] h-full bg-slate-950 relative flex flex-col items-center justify-center overflow-hidden border-l border-slate-800">
        
        {/* Fondo con efecto de red/brillo futurista */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>

        {!mostrarIA ? (
          <div className="text-center p-8 transition-opacity duration-700 relative z-10 flex flex-col items-center">
            
            {/* Núcleo de la IA (Animación de anillos rotatorios) */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-10">
              {/* Anillo exterior rotando */}
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-500/30 animate-[spin_4s_linear_infinite]"></div>
              {/* Anillo interior punteado rotando en reversa */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_6s_linear_infinite_reverse]"></div>
              {/* Brillo central */}
              <div className="absolute inset-6 rounded-full bg-cyan-600/10 shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-pulse"></div>
              {/* Ícono de la IA */}
              <Bot size={56} className="text-cyan-300 relative z-10 drop-shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
            </div>

            {/* Textos con estilo de interfaz médica */}
            <div className="flex items-center justify-center gap-2 mb-3 text-cyan-500 font-mono text-sm tracking-[0.3em]">
              <Activity size={16} className="animate-pulse" />
              <span>SISTEMA EN ESPERA</span>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              MediGuide <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">A.I.</span>
            </h2>
            
            <p className="text-slate-400 mb-12 text-lg max-w-sm leading-relaxed">
              Tu asistente médico holográfico está listo. Di <span className="text-cyan-400 font-bold">"conectar asistente"</span> o toca el botón para iniciar protocolos.
            </p>

            {/* Botón futurista */}
            <button 
              type="button"
              onClick={() => handleNavigate('voz')} 
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 font-bold text-white transition-all duration-300 bg-cyan-950/50 border border-cyan-500/50 rounded-full hover:bg-cyan-600 hover:text-white hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-95 overflow-hidden"
            >
              {/* Efecto de barrido de luz en hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              <Sparkles size={20} className="text-cyan-300 group-hover:text-white transition-colors" />
              <span className="tracking-wide">INICIALIZAR CONEXIÓN</span>
            </button>

          </div>
        ) : (
          <div className="w-full h-full relative animate-in zoom-in-95 duration-500 bg-black">
            {/* Cabecera del modo IA Activa */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent z-40 flex items-center justify-between px-6 pointer-events-none">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                CONEXIÓN ESTABLECIDA
              </div>
            </div>

            <button 
              type="button"
              onClick={cerrarIA} 
              className="absolute top-6 right-6 z-50 bg-slate-900/60 border border-red-500/30 p-3 rounded-full text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              title="Cerrar asistente"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            
            <iframe 
              ref={iframeRef} 
              src={URL_IA} 
              title="Asistente Médico MediGuide"
              className="w-full h-full border-none opacity-0 animate-[fadeIn_1s_ease-in-out_forwards_0.5s]" 
              allow="microphone; camera; clipboard-write; screen-wake-lock; autoplay" 
            />
          </div>
        )}
      </section>
      
    </main>
  );
}
