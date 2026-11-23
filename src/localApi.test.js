import { localApi, analyzePlate, answerFor } from './localApi';

const form = (fields) => {
  const f = new FormData();
  Object.entries(fields).forEach(([k, v]) => f.append(k, v));
  return f;
};

test('chat messages are answered and stored as a conversation', async () => {
  const res = await localApi('/chatbot', { method: 'PUT', body: form({ id: '1', type: 'text', message: 'Qué debo comer en el almuerzo' }) });
  expect((await res.json()).respuesta).toMatch(/Harvard/);
  const { chats } = await (await localApi('/show-chats')).json();
  expect(chats).toHaveLength(1);
  expect(chats[0].messages.map((m) => m.role)).toEqual(['user', 'assistant']);
  await localApi('/delete-chat/1', { method: 'DELETE' });
  expect((await (await localApi('/show-chats')).json()).chats).toHaveLength(0);
}, 10000);

test('plate analysis percentages add up to 100 and come with advice', () => {
  [0, 1, 2].forEach((seed) => {
    const a = analyzePlate(seed);
    expect(a.porcentaje_verduras + a.porcentaje_proteinas + a.porcentaje_carbohidratos).toBe(100);
    expect(a.recomendaciones.length).toBeGreaterThan(0);
  });
});

test('analysis history is listed with next_id and can be deleted', async () => {
  const photo = new File(['fake'], 'plate.jpg', { type: 'image/jpeg' });
  const res = await localApi('/analyze-image', { method: 'PUT', body: form({ id: '1', media_file: photo }) });
  expect((await res.json()).imagen_original_url).toMatch(/^data:image/);
  const list = await (await localApi('/list-analyses')).json();
  expect(list.next_id).toBe(2);
  await localApi('/delete-analysis', { method: 'DELETE', body: JSON.stringify({ id: 1 }) });
  expect((await (await localApi('/list-analyses')).json()).analyses).toHaveLength(0);
}, 10000);

test('unknown topics get the default answer', () => {
  expect(answerFor('xyz')).toMatch(/demo/);
});

test('a greeting with a real question answers the question', () => {
  expect(answerFor('Hola, quiero bajar de peso, qué me recomiendas comer?')).toMatch(/Harvard/);
  expect(answerFor('hola')).toMatch(/Soy HealthIA/);
});
