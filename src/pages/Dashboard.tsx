import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProtocolo } from '../context/ProtocoloContext';
import { parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { CheckinStatus, Checkin } from '../types';

const TRACKER_DAYS = [
  { dayIndex: 1, label: 'SEG' },
  { dayIndex: 2, label: 'TER' },
  { dayIndex: 3, label: 'QUA' },
  { dayIndex: 4, label: 'QUI' },
  { dayIndex: 5, label: 'SEX' },
  { dayIndex: 6, label: 'SAB' },
  { dayIndex: 0, label: 'DOM' },
];

const MOTIVES = ['excesso', 'dúvida', 'cansaço', 'perfeccionismo', 'outro'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, getTodayStr, addCheckin } = useProtocolo();
  
  const [avoidReason, setAvoidReason] = useState<string | null>(null);
  const [showMotives, setShowMotives] = useState(false);

  const cycle = state.activeCycle;

  if (!cycle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <h2 className="text-2xl font-bold">Você ainda não iniciou um novo ciclo.</h2>
        <button
          onClick={() => navigate('/definir-semana')}
          className="bg-brand-primary text-white w-full max-w-[280px] py-4 rounded-xl font-medium"
        >
          Iniciar nova semana
        </button>
      </div>
    );
  }

  const todayStr = getTodayStr();
  const todayCheckin = cycle.checkins[todayStr];
  const totalCheckinsCount = Object.keys(cycle.checkins).length;
  const progressPercent = Math.min((totalCheckinsCount / 7) * 100, 100);

  const handleCheckin = (status: CheckinStatus, reason?: string) => {
    addCheckin(todayStr, status, reason);
    setShowMotives(false);
  };

  const completedCyclesCount = state.history.filter(c => c.status === 'CONCLUIDO').length;

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div className="bg-brand-primary text-white p-8 rounded-3xl shadow-md space-y-4">
        <p className="text-xs font-bold tracking-widest opacity-80 uppercase mb-4">
          Prioridade da Semana
        </p>
        <h2 className="text-3xl font-medium leading-tight mb-4">{cycle.priority}</h2>
        <p className="italic text-lg opacity-90">"{cycle.intention}"</p>
        <div className="pt-6 border-t border-white/20">
          <p className="text-sm font-light">Isso é o que importa agora.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Área da Vida</p>
            <p className="text-sm font-semibold">{cycle.area}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</p>
            <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold">EM ANDAMENTO</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Critério de término</p>
          <p className="text-sm text-gray-600">{cycle.endCriterion}</p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Progresso</h3>
            <span className="text-sm text-gray-400">Check-ins: {totalCheckinsCount}/7</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-brand-primary transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-8">
            {TRACKER_DAYS.map(({ dayIndex, label }) => {
              const checkinForDay = (Object.values(cycle.checkins) as Checkin[]).find(c => {
                try {
                  return parseISO(c.date).getDay() === dayIndex;
                } catch {
                  return false;
                }
              });

              let dotClass = "border-2 border-dashed border-gray-200 bg-transparent"; // Empty
              if (checkinForDay) {
                if (checkinForDay.status === 'AVANCEI') dotClass = "bg-brand-primary border-transparent text-white";
                if (checkinForDay.status === 'EVITEI') dotClass = "bg-gray-600 border-transparent text-white";
              }

              return (
                <div key={label} className={cn("flex flex-col items-center gap-3", !checkinForDay && "text-opacity-50 opacity-60")}>
                  <span className="text-[10px] font-bold text-gray-400">{label}</span>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xs font-bold", dotClass)}>
                    {checkinForDay?.status === 'AVANCEI' && "✓"}
                    {checkinForDay?.status === 'EVITEI' && "X"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {!todayCheckin && !showMotives && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-center font-bold text-lg">Hoje você avançou ou evitou?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCheckin('AVANCEI')}
                className="py-4 border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
              >
                AVANCEI
              </button>
              <button
                onClick={() => setShowMotives(true)}
                className="py-4 border-2 border-gray-700 text-gray-700 font-bold rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
              >
                EVITEI
              </button>
            </div>
          </div>
        )}

        {!todayCheckin && showMotives && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-center font-bold text-lg mb-4">O que atrapalhou hoje?</h3>
            <div className="grid grid-cols-2 gap-2">
              {MOTIVES.map(m => (
                <button
                  key={m}
                  onClick={() => handleCheckin('EVITEI', m)}
                  className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-xl transition-colors capitalize"
                >
                  {m}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowMotives(false)}
              className="w-full mt-4 py-2 text-sm text-gray-500 underline"
            >
              Voltar
            </button>
          </div>
        )}

        {todayCheckin && (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
            <p className="font-medium text-gray-800">Seu check-in de hoje já foi registrado.</p>
            <button
              onClick={() => {
                addCheckin(todayStr, 'AVANCEI'); // Reset temporarily by un-checking? Wait, the prompt says "Se alterar: Atualizar o check-in existente, não criar outro".
                // I will just clear the local view to allow re-selection
                // Actually to clear I can't easily remove from state currently, but I can navigate to /checkin where they can overwrite
                navigate('/checkin');
              }}
              className="text-brand-primary font-medium underline text-sm"
            >
              Alterar check-in de hoje
            </button>
          </div>
        )}
      </div>

      <div className="text-center py-4 text-sm text-gray-500">
        <p>Disciplina acumulada</p>
        <p className="font-bold text-gray-800 text-lg">{completedCyclesCount} ciclos concluídos</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/checkin')}
          className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase mb-4"
          style={{ backgroundColor: '#3E805F' }}
        >
          Fazer check-in de hoje
        </button>
        <button
          onClick={() => navigate('/historico')}
          className="w-full py-4 rounded-2xl font-bold tracking-wide border-2 transition-all text-gray-400 border-gray-200 hover:bg-gray-50 uppercase"
        >
          Ver histórico
        </button>
        <button
          onClick={() => navigate('/concluir')}
          className="w-full py-4 rounded-2xl font-bold tracking-wide border-2 transition-all text-gray-400 border-gray-200 hover:bg-gray-50 uppercase"
        >
          Concluir semana
        </button>
      </div>
    </div>
  );
}
