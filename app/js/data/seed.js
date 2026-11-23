import { QUESTOES_BASICAS } from './questoes-basicas.js';
import { QUESTOES_TI } from './questoes-ti.js';

// Aumente ao alterar o banco inicial: o app atualiza as questões autorais não editadas pelo usuário.
export const SEED_VERSION = 1;

export const QUESTOES_SEED = [...QUESTOES_BASICAS, ...QUESTOES_TI];
