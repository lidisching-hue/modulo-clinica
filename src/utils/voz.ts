export const hablar = (texto: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Tu navegador no soporta síntesis de voz.");
    return;
  }
  
  // Cancela cualquier audio que esté sonando
  window.speechSynthesis.cancel();
  
  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = 'es-ES'; 
  mensaje.rate = 1.0;     
  mensaje.pitch = 0.7; // Tono más grave para asimilar voz de hombre
  
  const voces = window.speechSynthesis.getVoices();
  const vocesEspanol = voces.filter(v => v.lang.startsWith('es'));
  
  // Buscar voces que suenen a hombre
  const nombresMasculinos = ['pablo', 'jorge', 'juan', 'diego', 'carlos', 'alfonso'];
  const vozMasculina = vocesEspanol.find(v => 
    nombresMasculinos.some(nombre => v.name.toLowerCase().includes(nombre))
  );

  if (vozMasculina) {
    mensaje.voice = vozMasculina;
  } else if (vocesEspanol.length > 0) {
    mensaje.voice = vocesEspanol[0];
  }

  window.speechSynthesis.speak(mensaje);
};

// Cargar voces en navegadores basados en Chromium
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}