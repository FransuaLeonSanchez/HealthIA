// HealthIA is a frontend-only POC: the endpoints the screens used to call on the
// hackathon backend are answered here, in the browser, and kept in localStorage.

const KEYS = { chats: 'healthia.chats', analyses: 'healthia.analyses' };
const memory = {};

const load = (key) => {
  if (!memory[key]) {
    try {
      memory[key] = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      memory[key] = [];
    }
  }
  return memory[key];
};

const save = (key, value) => {
  memory[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // shortcut: storage full (large photos) keeps data for this session only
  }
};

const reply = (data, status = 200) => ({
  ok: status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toDataUrl = (file) =>
  new Promise((resolve) => {
    if (!(file instanceof Blob)) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

/* ---------------------------- Chat assistant ---------------------------- */

// first match wins, so the greeting goes last
const TOPICS = [
  {
    words: ['comida', 'comer', 'dieta', 'nutri', 'desayuno', 'almuerzo', 'cena', 'plato', 'proteína', 'proteina', 'carbohidrato'],
    answer:
      'Una buena guía es el plato de Harvard: la mitad del plato con verduras, un cuarto con proteína (pollo, pescado, menestras) y un cuarto con carbohidratos integrales como quinua o arroz integral. Acompaña con agua y usa aceites saludables con moderación. 🥗',
  },
  {
    words: ['ejercicio', 'entren', 'rutina', 'correr', 'caminar', 'gym', 'pasos', 'cardio', 'fuerza'],
    answer:
      'Para empezar, apunta a 150 minutos de actividad moderada por semana (por ejemplo, 30 minutos de caminata rápida 5 días) y 2 sesiones de fuerza. Si ya entrenas, sube la intensidad de forma gradual y deja al menos un día de descanso. 🏃',
  },
  {
    words: ['dormir', 'sueño', 'sueno', 'descanso', 'insomnio', 'cansad'],
    answer:
      'Intenta dormir entre 7 y 9 horas, con horarios fijos para acostarte y despertar. Evita pantallas y cafeína en las 2 horas previas a dormir, y mantén tu cuarto oscuro y fresco. 😴',
  },
  {
    words: ['agua', 'hidrat', 'beber'],
    answer:
      'Como referencia, toma entre 2 y 2,5 litros de agua al día, y más si haces ejercicio o hace calor. Un buen indicador es que tu orina sea de color claro. 💧',
  },
  {
    words: ['peso', 'bajar', 'adelgaz', 'calor', 'grasa', 'subir'],
    answer:
      'Los cambios sostenibles funcionan mejor que las dietas estrictas: un déficit moderado de calorías, más proteína y verduras, menos ultraprocesados y actividad diaria. Apunta a 0,5 kg por semana y revisa tu progreso cada 2 semanas. ⚖️',
  },
  {
    words: ['estrés', 'estres', 'ansiedad', 'ánimo', 'animo', 'triste'],
    answer:
      'Prueba pausas de respiración (4 segundos inhalando, 6 exhalando) durante 2 minutos, una caminata corta al aire libre y dormir bien. Si el malestar se mantiene, conversa con un profesional de salud. 💙',
  },
  {
    words: ['hola', 'buenas', 'buenos', 'hey'],
    answer:
      '¡Hola! Soy HealthIA 👋 Puedo ayudarte con alimentación, actividad física, sueño e hidratación. ¿Por dónde empezamos?',
  },
];

const DEFAULT_ANSWER =
  'Puedo darte recomendaciones sobre alimentación, ejercicio, sueño, hidratación y manejo del estrés. Cuéntame tu objetivo y te propongo un siguiente paso. Recuerda que HealthIA es una demo y no reemplaza la consulta con un profesional.';

export const answerFor = (message, type = 'text') => {
  if (type === 'image') {
    return 'Recibí tu imagen 📷 Para un plato balanceado, revisa que la mitad sean verduras, un cuarto proteína y un cuarto carbohidratos. Si quieres un análisis detallado del plato, usa la opción "Analyze" del menú principal.';
  }
  if (type === 'audio') {
    return 'Recibí tu nota de voz 🎙️ En esta demo respondo mejor a mensajes de texto. Escríbeme tu pregunta sobre alimentación, ejercicio o sueño.';
  }
  const text = (message || '').toLowerCase();
  const topic = TOPICS.find(({ words }) => words.some((word) => text.includes(word)));
  return topic ? topic.answer : DEFAULT_ANSWER;
};

const chatbot = async (form) => {
  await wait(700);
  const id = parseInt(form.get('id'), 10) || 1;
  const type = form.get('type') || 'text';
  const message = form.get('message') || '';
  const respuesta = answerFor(message, type);

  const chats = load(KEYS.chats);
  let chat = chats.find((c) => c.id === id);
  if (!chat) {
    chat = {
      id,
      title: type === 'text' ? message.slice(0, 40) : type === 'image' ? 'Consulta con imagen' : 'Nota de voz',
      created_at: new Date().toISOString(),
      messages: [],
    };
    chats.push(chat);
  }
  if (type === 'image') {
    const image = await toDataUrl(form.get('media_file'));
    if (image) chat.messages.push({ role: 'user_media', content: image });
  }
  chat.messages.push({ role: 'user', content: message }, { role: 'assistant', content: respuesta });
  save(KEYS.chats, chats);
  return reply({ respuesta });
};

/* ---------------------------- Plate analysis ---------------------------- */

const PLATES = [
  {
    evaluacion_general: 'Plato alto en carbohidratos y con pocas verduras.',
    detalle_alimentos: [
      { nombre: 'Arroz blanco', categoria: 'Carbohidratos', porcentaje_area: 35 },
      { nombre: 'Papas fritas', categoria: 'Carbohidratos', porcentaje_area: 20 },
      { nombre: 'Carne salteada', categoria: 'Proteínas', porcentaje_area: 30 },
      { nombre: 'Tomate y cebolla', categoria: 'Verduras/vegetales', porcentaje_area: 15 },
    ],
  },
  {
    evaluacion_general: 'Buena fuente de proteína; conviene sumar más verduras.',
    detalle_alimentos: [
      { nombre: 'Pescado', categoria: 'Proteínas', porcentaje_area: 45 },
      { nombre: 'Camote', categoria: 'Carbohidratos', porcentaje_area: 20 },
      { nombre: 'Choclo', categoria: 'Carbohidratos', porcentaje_area: 10 },
      { nombre: 'Cebolla y lechuga', categoria: 'Verduras/vegetales', porcentaje_area: 25 },
    ],
  },
  {
    evaluacion_general: 'Plato bastante balanceado, cercano al plato de Harvard.',
    detalle_alimentos: [
      { nombre: 'Ensalada mixta', categoria: 'Verduras/vegetales', porcentaje_area: 45 },
      { nombre: 'Pechuga de pollo', categoria: 'Proteínas', porcentaje_area: 27 },
      { nombre: 'Quinua', categoria: 'Carbohidratos', porcentaje_area: 28 },
    ],
  },
];

const share = (foods, category) =>
  foods.filter((f) => f.categoria === category).reduce((sum, f) => sum + f.porcentaje_area, 0);

export const analyzePlate = (seed) => {
  const plate = PLATES[seed % PLATES.length];
  const verduras = share(plate.detalle_alimentos, 'Verduras/vegetales');
  const proteinas = share(plate.detalle_alimentos, 'Proteínas');
  const carbohidratos = share(plate.detalle_alimentos, 'Carbohidratos');

  // compare with the Harvard plate: 50% vegetables, 25% protein, 25% carbs
  const recomendaciones = [];
  if (verduras < 50) recomendaciones.push(`Aumenta las verduras en ${50 - verduras}% hasta cubrir la mitad del plato.`);
  if (carbohidratos > 25) recomendaciones.push(`Reduce los carbohidratos en ${carbohidratos - 25}% y prefiere opciones integrales.`);
  if (proteinas > 25) recomendaciones.push(`Reduce la porción de proteína en ${proteinas - 25}% para dar espacio a las verduras.`);
  if (proteinas < 25) recomendaciones.push(`Suma ${25 - proteinas}% de proteína magra (pollo, pescado o menestras).`);
  if (recomendaciones.length === 0) recomendaciones.push('¡Buen trabajo! Mantén estas proporciones en tus comidas.');

  return {
    evaluacion_general: plate.evaluacion_general,
    porcentaje_verduras: verduras,
    porcentaje_proteinas: proteinas,
    porcentaje_carbohidratos: carbohidratos,
    detalle_alimentos: plate.detalle_alimentos,
    recomendaciones,
  };
};

const analyzeImage = async (form) => {
  await wait(1200);
  const file = form.get('media_file');
  const image = await toDataUrl(file);
  const analysis = analyzePlate(file && file.size ? file.size : Date.now());
  const analyses = load(KEYS.analyses);
  const id = parseInt(form.get('id'), 10) || analyses.length + 1;
  const record = {
    id,
    fecha: new Date().toISOString(),
    analisis: analysis,
    imagen_original_url: image,
    imagen_procesada_url: image,
  };
  save(KEYS.analyses, [...analyses.filter((a) => a.id !== id), record]);
  return reply({ id, ...analysis, imagen_original_url: image, imagen_procesada_url: image });
};

/* -------------------------------- Router -------------------------------- */

export async function localApi(path, { method = 'GET', body } = {}) {
  if (path === '/chatbot' && method === 'PUT') return chatbot(body);
  if (path === '/show-chats') return reply({ chats: load(KEYS.chats) });
  if (path.startsWith('/delete-chat/') && method === 'DELETE') {
    const id = parseInt(path.split('/').pop(), 10);
    save(KEYS.chats, load(KEYS.chats).filter((c) => c.id !== id));
    return reply({ deleted: id });
  }
  if (path === '/analyze-image' && method === 'PUT') return analyzeImage(body);
  if (path === '/list-analyses') {
    const analyses = load(KEYS.analyses);
    const nextId = analyses.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    return reply({ analyses, next_id: nextId });
  }
  if (path === '/delete-analysis' && method === 'DELETE') {
    const { id } = JSON.parse(body);
    save(KEYS.analyses, load(KEYS.analyses).filter((a) => a.id !== id));
    return reply({ deleted: id });
  }
  return reply({ error: `Unknown endpoint ${path}` }, 404);
}
