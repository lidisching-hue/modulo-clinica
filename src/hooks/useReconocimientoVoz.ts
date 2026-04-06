import { useState, useEffect, useRef } from 'react';

export const useReconocimientoVoz = () => {
  const [comandoVoz, setComandoVoz] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("El reconocimiento de voz no está soportado en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'es-PE';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setComandoVoz(transcript);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.onerror = (event: any) => {
      console.error("Error de voz:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setComandoVoz(''); 
      // ✅ TRY-CATCH: Evita que la app se ponga en blanco si hay un error al iniciar
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("El micrófono ya estaba encendido o hubo un error", error);
        setIsListening(false);
      }
    }
  };

  const limpiarComando = () => setComandoVoz('');

  return { comandoVoz, limpiarComando, isListening, toggleListening };
};