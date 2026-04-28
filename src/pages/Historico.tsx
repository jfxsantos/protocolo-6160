import { useNavigate } from 'react-router-dom';
import { useProtocolo } from '../context/ProtocoloContext';
import { cn } from '../lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Checkin } from '../types';

export default function Historico() {
  const navigate = useNavigate();
  const { state } = useProtocolo();

  const completedCyclesCount = state.history.filter(c => c.status === 'CONCLUIDO').length;
  
  // Combine active cycle and history for display
  const allCycles = [...state.history];
  if (state.activeCycle) {
    allCycles.push(state.activeCycle);
  }

  // Sort by date descending (assuming id is timestamp)
  allCycles.sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-6">
      <div className="flex items-center pt-2">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold ml-2">Seu progresso</h2>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <span className="font-medium text-gray-600 tracking-wide uppercase text-sm">Disciplina acumulada</span>
        <span className="font-bold text-xl text-brand-primary">{completedCyclesCount} ciclos concluídos</span>
      </div>

      <div className="space-y-4 flex-1">
        {allCycles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum histórico disponível ainda.
          </div>
        ) : (
          allCycles.map((cycle, index) => {
            const checkins = Object.values(cycle.checkins) as Checkin[];
            const avanceiCount = checkins.filter(c => c.status === 'AVANCEI').length;
            const eviteiCount = checkins.filter(c => c.status === 'EVITEI').length;
            
            return (
              <div key={cycle.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Ciclo {allCycles.length - index} • {cycle.area}
                    </p>
                    <h3 className="font-bold text-lg text-brand-text">{cycle.priority}</h3>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                    cycle.status === 'EM_ANDAMENTO' ? "bg-amber-100 text-amber-800" :
                    cycle.status === 'CONCLUIDO' ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    {cycle.status === 'EM_ANDAMENTO' && 'Em andamento'}
                    {cycle.status === 'CONCLUIDO' && '✔ Concluído'}
                    {cycle.status === 'NAO_CONCLUIDO' && '✖ Não concluído'}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm italic text-gray-600">"{cycle.intention}"</p>
                  <p className="text-sm text-gray-800"><span className="text-gray-500 text-xs uppercase tracking-wider">Término:</span> {cycle.endCriterion}</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                    <span className="font-medium text-gray-700">{avanceiCount} Avancei</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                    <span className="font-medium text-gray-700">{eviteiCount} Evitei</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="w-full py-4 rounded-2xl font-bold tracking-wide border-2 transition-all text-gray-400 border-gray-200 hover:bg-gray-50 uppercase"
      >
        Voltar ao dashboard
      </button>
    </div>
  );
}
