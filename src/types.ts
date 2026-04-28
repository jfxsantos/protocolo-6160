export type Area = 'Profissional' | 'Pessoal' | 'Físico' | 'Intelectual' | 'Espiritual' | 'Relacional';

export type CheckinStatus = 'AVANCEI' | 'EVITEI';

export interface Checkin {
  date: string; // YYYY-MM-DD
  status: CheckinStatus;
  reason?: string; 
}

export type CycleStatus = 'EM_ANDAMENTO' | 'CONCLUIDO' | 'NAO_CONCLUIDO';

export interface Cycle {
  id: string; // timestamp or uuid
  startDate: string; // YYYY-MM-DD
  area: Area;
  intention: string;
  priority: string;
  endCriterion: string;
  status: CycleStatus;
  checkins: Record<string, Checkin>; // key is YYYY-MM-DD
}

export interface AppState {
  activeCycle: Cycle | null;
  history: Cycle[];
}
