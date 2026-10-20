// Contenido compartido de la home.

export const WHATSAPP = 'https://wa.me/34609575722';
export const FORMSPREE = 'https://formspree.io/f/xdajjggv';
export const INSTAGRAM = 'https://www.instagram.com/jaime.gomezgp/';
export const LINKEDIN = 'https://www.linkedin.com/in/jaime-g%C3%B3mez-de-alvar%C3%A9-74baa417a/';

// Preguntas frecuentes: la misma lista pinta la sección visible y el FAQPage del JSON-LD.
export const FAQ: { q: string; a: string }[] = [
  { q: '¿Tengo que cambiar mi web para usar una herramienta?', a: 'No. Las herramientas se integran en tu web actual. Si tu web necesita un cambio, te lo diré en la observación.' },
  { q: '¿Qué costes tengo después?', a: 'Sin cuotas de plataforma. El dominio y, si la herramienta lo necesita, algún servicio externo como el envío de emails. Te los detallo en la propuesta, con quién paga cada uno.' },
  { q: '¿Qué pasa con los datos de mis pacientes y clientes?', a: 'Se recogen solo los datos imprescindibles y en cada proyecto definimos dónde se guardan, quién accede y cómo se protegen.' },
  { q: '¿La IA toma decisiones clínicas?', a: 'No. Las herramientas ordenan la información; las decisiones son siempre del profesional.' },
  { q: '¿Me garantizas salir primero en Google o en ChatGPT?', a: 'No prometo posiciones ni recomendaciones. Trabajo la estructura, el contenido y tu presencia digital, y medimos lo que se puede observar.' },
  { q: '¿Qué pasa si dejo de trabajar contigo?', a: 'La web y el código entregado siguen siendo tuyos según lo acordado. Si alguna función depende de servicios externos, te explico qué tiene que seguir activo y qué cuesta.' },
  { q: '¿Trabajas fuera de Madrid?', a: 'Sí, con negocios de toda España. Casi todo se hace en remoto.' },
];

// Huecos pendientes de contenido real. Mientras estén vacíos, su bloque no se renderiza.
export const PENDIENTE = {
  // Frase literal de Laura, aprobada por ella
  fraseLaura: '' as string,
  // Notas de voz de Jaime: { src: '/assets/....m4a', duracion: '25 s' }
  notaEscala: null as null | { src: string; duracion: string },
  notaSobreMi: null as null | { src: string; duracion: string },
  // Vídeo de 30 s del sistema de derivaciones (datos ficticios): { webm, mp4, poster }
  videoDerivaciones: null as null | { webm: string; mp4: string; poster: string },
  // Tarjeta de Dogtitude en «Proyectos»
  dogtitude: null as null | { sector: string; titulo: string; texto: string; href?: string },
};
