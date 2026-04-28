import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area } from '../types';
import { useProtocolo } from '../context/ProtocoloContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const AREAS: Area[] = ['Profissional', 'Pessoal', 'Físico', 'Intelectual', 'Espiritual', 'Relacional'];

const INTENCOES = [
  'Agir com constância',
  'Manter foco no que importa',
  'Evitar distrações desnecessárias',
  'Servir com excelência',
  'Executar mesmo sem motivação',
  'Avançar com calma e disciplina'
];

const PRIORIDADES_POR_AREA: Record<Area, string[]> = {
  'Profissional': [
    'Finalizar uma proposta importante',
    'Organizar a rotina de trabalho',
    'Lançar um projeto',
    'Fechar uma pendência profissional'
  ],
  'Pessoal': [
    'Organizar finanças',
    'Resolver uma pendência pessoal',
    'Reorganizar a rotina',
    'Planejar uma decisão importante'
  ],
  'Físico': [
    'Melhorar alimentação',
    'Regular o sono',
    'Iniciar rotina de treino',
    'Caminhar diariamente'
  ],
  'Intelectual': [
    'Ler um livro específico',
    'Estudar 30 minutos por dia',
    'Concluir um curso',
    'Aprender uma nova habilidade'
  ],
  'Espiritual': [
    'Separar tempo diário de oração',
    'Ler um capítulo bíblico por dia',
    'Praticar silêncio e reflexão',
    'Fazer uma revisão da semana'
  ],
  'Relacional': [
    'Resolver uma conversa pendente',
    'Dedicar tempo à família',
    'Reconectar com alguém importante',
    'Melhorar a comunicação com alguém'
  ]
};

export default function DefinirSemana() {
  const navigate = useNavigate();
  const { state, startCycle } = useProtocolo();

  const [step, setStep] = useState(0);
  const [area, setArea] = useState<Area | null>(null);
  const [intention, setIntention] = useState('');
  const [priority, setPriority] = useState('');
  const [endCriterion, setEndCriterion] = useState('');

  if (state.activeCycle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <h2 className="text-2xl font-bold">Você já tem uma semana em andamento.</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-brand-primary text-white w-full max-w-[280px] py-4 rounded-xl font-medium"
        >
          Ir para o dashboard
        </button>
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const renderStepContent = () => {
    switch (step) {
      case 0: // Splash
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
            <h2 className="text-3xl font-bold">Definir semana</h2>
            <p className="text-xl text-gray-600">O que realmente precisa avançar nesta semana?</p>
            <button
              onClick={handleNext}
              className="mt-8 w-full max-w-[280px] py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase flex items-center justify-center gap-2"
              style={{ backgroundColor: '#3E805F' }}
            >
              Definir minha prioridade
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 1: // Area
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">1. Área da vida</h3>
            <div className="grid gap-3">
              {AREAS.map(a => (
                <button
                  key={a}
                  onClick={() => { setArea(a); handleNext(); }}
                  className={cn(
                    "p-6 rounded-2xl border text-left font-medium text-lg transition-all shadow-sm",
                    area === a ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // Intention
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">2. Intenção da semana</h3>
            <p className="text-gray-600 mb-6">Qual atitude você quer cultivar nesta semana?</p>
            <div className="grid gap-3 mb-6">
              {INTENCOES.map(int => (
                <button
                  key={int}
                  onClick={() => { setIntention(int); handleNext(); }}
                  className={cn(
                    "p-5 rounded-2xl border text-left text-sm transition-all shadow-sm",
                    intention === int ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-medium" : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  {int}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t">
              <p className="text-sm text-gray-500 mb-2">Ou digite sua própria:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={intention}
                  onChange={e => setIntention(e.target.value)}
                  className="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ex: Fazer com excelência"
                />
                <button
                  disabled={!intention.trim()}
                  onClick={handleNext}
                  className="px-4 bg-brand-primary text-white rounded-xl disabled:opacity-50"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3: // Priority
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">3. Prioridade da semana</h3>
            <p className="text-gray-600 mb-6">Qual é a única prioridade que tornará sua semana válida?</p>
            {area && (
              <div className="grid gap-3 mb-6">
                {PRIORIDADES_POR_AREA[area].map(pri => (
                  <button
                    key={pri}
                    onClick={() => { setPriority(pri); handleNext(); }}
                    className={cn(
                      "p-5 rounded-2xl border text-left text-sm transition-all shadow-sm",
                      priority === pri ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-medium" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-auto pt-6 border-t">
              <p className="text-sm text-gray-500 mb-2">Ou digite sua própria:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Ex: Terminar relatório"
                />
                <button
                  disabled={!priority.trim()}
                  onClick={handleNext}
                  className="px-4 bg-brand-primary text-white rounded-xl disabled:opacity-50"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 4: // End criterion
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-6">4. Critério de término</h3>
            <p className="text-gray-600 mb-6">Como você saberá que essa prioridade foi concluída?</p>
            <textarea
              value={endCriterion}
              onChange={e => setEndCriterion(e.target.value)}
              className="w-full p-4 rounded-xl border min-h-[140px] focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Ex: O PDF final foi enviado por email..."
            />
            <button
              disabled={!endCriterion.trim()}
              onClick={handleNext}
              className="mt-8 w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase disabled:opacity-50"
              style={{ backgroundColor: '#3E805F' }}
            >
              Revisar semana
            </button>
          </div>
        );

      case 5: // Summary
        return (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold mb-8 text-center">Resumo da semana</h3>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Área</p>
                <p className="text-lg font-medium">{area}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Intenção</p>
                <p className="text-lg font-medium">{intention}</p>
              </div>
              <div>
                <p className="text-sm text-brand-primary uppercase tracking-wider font-semibold mb-1">Prioridade</p>
                <p className="text-xl font-bold text-brand-text">{priority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Critério de término</p>
                <p className="text-base">{endCriterion}</p>
              </div>
            </div>

            <div className="my-8 text-center space-y-1">
              <p className="font-medium text-lg">Este será o seu foco nesta semana.</p>
              <p className="text-gray-500">Todo o resto entra em modo manutenção.</p>
            </div>

            <button
              onClick={() => {
                startCycle({ area: area!, intention, priority, endCriterion });
                navigate('/dashboard');
              }}
              className="mt-auto w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase"
              style={{ backgroundColor: '#3E805F' }}
            >
              Confirmar ciclo
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {step > 0 && (
        <button onClick={handleBack} className="p-2 mb-4 -ml-2 text-gray-500 hover:text-gray-900 w-fit">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      {renderStepContent()}
    </div>
  );
}
