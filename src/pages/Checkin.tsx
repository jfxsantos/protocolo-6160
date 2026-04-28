import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProtocolo } from '../context/ProtocoloContext';
import { CheckinStatus } from '../types';

const MOTIVES = ['excesso', 'dúvida', 'cansaço', 'perfeccionismo', 'outro'];

export default function Checkin() {
  const navigate = useNavigate();
  const { state, getTodayStr, addCheckin } = useProtocolo();
  
  const [showMotives, setShowMotives] = useState(false);

  const cycle = state.activeCycle;

  if (!cycle) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
        <h2 className="text-xl font-bold">Nenhum ciclo ativo.</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 font-bold tracking-wide uppercase hover:underline text-sm"
        >
          Voltar ao dashboard
        </button>
      </div>
    );
  }

  const todayStr = getTodayStr();

  const handleCheckin = (status: CheckinStatus, reason?: string) => {
    addCheckin(todayStr, status, reason);
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col pt-8 space-y-8">
      <h2 className="text-2xl font-bold text-center">Check-in Diário</h2>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
        {!showMotives ? (
          <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col justify-center text-center">
            <h3 className="font-bold text-xl">Hoje você avançou ou evitou?</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">
              Sua prioridade: <strong>{cycle.priority}</strong>
            </p>
            <div className="grid gap-4 mt-8 max-w-xs mx-auto w-full">
              <button
                onClick={() => handleCheckin('AVANCEI')}
                className="py-5 border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-colors text-lg"
              >
                AVANCEI
              </button>
              <button
                onClick={() => setShowMotives(true)}
                className="py-5 border-2 border-gray-700 text-gray-700 font-bold rounded-xl hover:bg-gray-700 hover:text-white transition-colors text-lg"
              >
                EVITEI
              </button>
            </div>
            {cycle.checkins[todayStr] && (
               <p className="text-sm text-brand-primary font-medium mt-4">
                 Você já fez check-in hoje. Ao escolher acima, você alterará o check-in existente.
               </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col justify-center">
            <h3 className="text-center font-bold text-xl mb-4">O que atrapalhou hoje?</h3>
            <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto w-full">
              {MOTIVES.map(m => (
                <button
                  key={m}
                  onClick={() => handleCheckin('EVITEI', m)}
                  className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors capitalize text-base"
                >
                  {m}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowMotives(false)}
              className="w-full mt-6 py-2 text-gray-500 underline text-base"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="w-full py-4 rounded-2xl font-bold tracking-wide border-2 transition-all text-gray-400 border-gray-200 hover:bg-gray-50 uppercase mt-auto"
      >
        Voltar ao dashboard
      </button>
    </div>
  );
}
