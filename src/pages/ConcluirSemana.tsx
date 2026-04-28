import { useNavigate } from 'react-router-dom';
import { useProtocolo } from '../context/ProtocoloContext';
import { CheckCircle2, TrendingUp, RotateCw, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Checkin } from '../types';

export default function ConcluirSemana() {
  const navigate = useNavigate();
  const { state, finishActiveCycle } = useProtocolo();

  const cycle = state.activeCycle;

  if (!cycle) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
        <h2 className="text-xl font-bold">Nenhum ciclo ativo.</h2>
        <button onClick={() => navigate('/dashboard')} className="text-brand-primary underline">
          Voltar ao dashboard
        </button>
      </div>
    );
  }

  const checkins = Object.values(cycle.checkins) as Checkin[];
  const totalCheckinsCount = checkins.length;
  const avanceiCount = checkins.filter(c => c.status === 'AVANCEI').length;
  const eviteiCount = checkins.filter(c => c.status === 'EVITEI').length;

  let message = "";
  let colorClass = "";
  let barColor = "";
  let Icon = RotateCw;

  if (avanceiCount <= 2) {
    message = "Você iniciou o ciclo. Continue avançando.";
    colorClass = "text-brand-danger";
    barColor = "bg-brand-danger";
    Icon = RotateCw;
  } else if (avanceiCount <= 5) {
    message = "Você avançou. A consistência está sendo construída.";
    colorClass = "text-brand-warning";
    barColor = "bg-brand-warning";
    Icon = TrendingUp;
  } else {
    message = "Você manteve o foco no que realmente importa.";
    colorClass = "text-brand-primary";
    barColor = "bg-brand-primary";
    Icon = CheckCircle2;
  }

  const handleConcluir = () => {
    finishActiveCycle();
    navigate('/historico');
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center pt-2">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold ml-2">Resumo da semana</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{cycle.area}</p>
          <h3 className="font-bold text-2xl text-brand-text">{cycle.priority}</h3>
          <p className="text-sm italic text-gray-600 mt-2">"{cycle.intention}"</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Critério de término</p>
          <p className="text-sm text-gray-800">{cycle.endCriterion}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 text-center flex flex-col items-center">
        <div className={cn("p-4 rounded-full", avanceiCount <= 2 ? "bg-brand-danger/10" : avanceiCount <= 5 ? "bg-brand-warning/10" : "bg-brand-primary/10")}>
           <Icon className={cn("w-10 h-10", colorClass)} />
        </div>
        
        <div className="space-y-2">
          <p className={cn("font-bold text-xl", colorClass)}>{message}</p>
          <p className="text-gray-600">Cada ciclo fechado fortalece sua disciplina.</p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-600">Check-ins realizados</span>
            <span className="font-bold">{totalCheckinsCount}/7</span>
          </div>
          
          <div className="flex w-full h-3 rounded-full overflow-hidden bg-neutral-100">
             <div className={cn("h-full transition-all duration-500", barColor)} style={{ width: `${Math.min((totalCheckinsCount/7)*100, 100)}%` }}></div>
          </div>
          
          <div className="flex justify-center gap-6 pt-2 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-brand-primary">{avanceiCount}</span>
              <span className="text-gray-500 text-xs uppercase tracking-wider">Avancei</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-gray-700">{eviteiCount}</span>
              <span className="text-gray-500 text-xs uppercase tracking-wider">Evitei</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <button
          onClick={handleConcluir}
          className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase flex items-center justify-center gap-2"
          style={{ backgroundColor: '#3E805F' }}
        >
          Confirmar conclusão
        </button>
      </div>
    </div>
  );
}
