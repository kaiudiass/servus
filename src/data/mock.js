// Perfil do Usuário Logado (Simula: GET /auth/me)
export const LOGGED_USER = {
  id: '1',
  name: 'Kaio',
  email: 'teste@gmail.com',
  role: 'admin',
  sectors: ['direcao']
};

/**
 * RECURSOS DO PAINEL ADMINISTRATIVO
 */
export const ADMIN_USERS = [
  { id: '1', name: 'Kaio', email: 'teste@gmail.com', role: 'admin', sectors: ['direcao'] },
  { id: '2', name: 'Lucas Silva', email: 'lucas@ig.com.br', role: 'user', sectors: ['louvor'] },
  { id: '3', name: 'Maria Santos', email: 'maria@ig.com.br', role: 'user', sectors: ['midia'] },
];

export const ADMIN_SECTORS = [
  { id: 'direcao', name: 'Direção de Culto', description: 'Coordenação geral do culto.' },
  { id: 'louvor', name: 'Louvor', description: 'Ministério de louvor.' },
  { id: 'midia', name: 'Mídia', description: 'Som e Projeção.' },
];

export const ADMIN_SCALES = [
  { id: 'a1', date: '2026-04-26', day: 'domingo', time: '19:00', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
  { id: 'a2', date: '2026-04-29', day: 'quarta', time: '19:00', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
];

export const ADMIN_NOTICES = [
  { id: 'n1', title: 'Reunião Admin', description: 'Pauta: Nova Escala de Maio.', date: '2026-04-28', priority: 'high', sectors: ['direcao', 'midia'] },
];

/**
 * RECURSOS DA ÁREA DO VOLUNTÁRIO (Simula endpoints granulares)
 */

// Endpoint: GET /user/scales/upcoming?onlyMe=false
export const USER_UPCOMING_ALL = [
  { id: 'ua1', date: '2026-04-28', day: 'terca', time: '20:00', sectors: { louvor: ['Lucas Silva'] }, createdBy: '1' },
  { id: 'ua2', date: '2026-04-29', day: 'quarta', time: '19:30', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
  { id: 'ua3', date: '2026-05-03', day: 'domingo', time: '18:00', sectors: { midia: ['Maria Santos'] }, createdBy: '1' },
];

// Endpoint: GET /user/scales/history?onlyMe=false
export const USER_HISTORY_ALL = [
  { id: 'ha1', date: '2026-04-26', day: 'domingo', time: '19:00', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
  { id: 'ha2', date: '2026-04-19', day: 'domingo', time: '19:00', sectors: { louvor: ['Lucas Silva'] }, createdBy: '1' },
];

// Endpoint: GET /user/scales/upcoming?onlyMe=true (Filtrado pelo Token no Backend)
export const USER_UPCOMING_MY = [
  { id: 'ua2', date: '2026-04-29', day: 'quarta', time: '19:30', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
];

// Endpoint: GET /user/scales/history?onlyMe=true (Filtrado pelo Token no Backend)
export const USER_HISTORY_MY = [
  { id: 'ha1', date: '2026-04-26', day: 'domingo', time: '19:00', sectors: { direcao: ['Kaio'] }, createdBy: '1' },
];

// Endpoint: GET /user/notices
export const USER_NOTICES = [
  { id: 'un1', title: 'Aviso Geral', description: 'Não esqueça o horário!', date: '2026-04-30', priority: 'normal', sectors: [] },
];

/**
 * CONFIGURAÇÕES GLOBAIS
 */
export const CULT_DAYS = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];