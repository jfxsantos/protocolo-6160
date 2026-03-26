/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react';

type PriorityData = {
  id?: string;
  area: string;
  intention?: string;
  priority: string;
  completionCriteria: string;
  status?: 'em andamento' | 'concluído';
};

type CheckinData = {
  date: string;
  status: 'AVANCEI' | 'EVITEI';
  reason?: string;
};

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-7xl font-black tracking-tighter text-[#1F2933]">Protocolo 6160</h1>
        <p className="text-xl font-medium text-[#6B7280]">Uma prioridade. Uma semana. Foco absoluto.</p>
        <button 
          onClick={() => navigate('/definir-semana')}
          className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors"
        >
          Começar minha semana
        </button>
      </div>
    </div>
  );
}

const areaSuggestions: Record<string, string[]> = {
  'Profissional': ['Finalizar projeto importante', 'Organizar caixa de entrada', 'Atualizar currículo', 'Planejar próxima semana'],
  'Pessoal': ['Organizar a casa', 'Planejar viagem', 'Resolver pendências financeiras', 'Desconectar das redes sociais'],
  'Físico': ['Iniciar rotina de treino', 'Melhorar alimentação', 'Regular horário de sono', 'Caminhar diariamente'],
  'Intelectual': ['Ler livro específico', 'Estudar 30 minutos por dia', 'Concluir curso', 'Aprender nova habilidade'],
  'Espiritual': ['Meditar diariamente', 'Praticar gratidão', 'Ler texto inspirador', 'Tempo de silêncio'],
  'Relacional': ['Sair com amigos', 'Ligar para familiares', 'Tempo de qualidade com parceiro(a)', 'Conhecer pessoas novas'],
};

const intentionSuggestions = [
  'Agir com constância',
  'Manter foco no que importa',
  'Evitar distrações desnecessárias',
  'Servir com excelência',
  'Executar mesmo sem motivação',
  'Avançar com calma e disciplina'
];

function DefinirSemana({ onSave, hasActiveCycle }: { onSave: (data: PriorityData) => void, hasActiveCycle: boolean }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [area, setArea] = useState('Profissional');
  const [intention, setIntention] = useState('');
  const [priority, setPriority] = useState('');
  const [criteria, setCriteria] = useState('');

  if (hasActiveCycle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Você já tem uma semana em andamento.</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors"
          >
            Ir para o dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    onSave({ area, intention, priority, completionCriteria: criteria });
    navigate('/ciclo-iniciado');
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          key="step1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full text-center space-y-10"
        >
          <div className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-[#6B7280] uppercase">Definir semana</h2>
            <h1 className="text-4xl font-black tracking-tight text-[#1F2933] leading-tight">
              O que realmente precisa avançar nesta semana?
            </h1>
          </div>
          <button 
            onClick={handleNext}
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors shadow-sm"
          >
            Definir minha prioridade
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-[#6B7280] uppercase">Passo 1 de 4</h2>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2933]">Área da vida</h1>
            <p className="text-[#6B7280]">Qual área precisa da sua atenção agora?</p>
          </div>
          <div className="space-y-4">
            {Object.keys(areaSuggestions).map((a) => (
              <button
                key={a}
                onClick={() => { setArea(a); handleNext(); }}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors ${area === a ? 'border-[#3E805F] bg-[#3E805F]/5' : 'border-[#D1D5DB] bg-white hover:border-[#3E805F]/50'}`}
              >
                <span className="font-semibold text-lg">{a}</span>
              </button>
            ))}
          </div>
          <button onClick={handleBack} className="w-full text-center text-[#6B7280] underline pt-4 hover:text-[#1F2933]">Voltar</button>
        </motion.div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          key="step3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-[#6B7280] uppercase">Passo 2 de 4</h2>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2933]">Intenção da semana</h1>
            <p className="text-[#6B7280]">Qual atitude você quer cultivar nesta semana?</p>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Ex: Agir com constância"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3E805F] focus:border-transparent"
              autoFocus
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {intentionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setIntention(suggestion)}
                  className="text-sm bg-[#D1D5DB]/50 text-[#4B5563] px-4 py-2 rounded-full hover:bg-[#D1D5DB] hover:text-[#1F2933] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <button 
              onClick={handleNext}
              disabled={!intention.trim()}
              className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
            <button onClick={handleBack} className="w-full text-center text-[#6B7280] underline hover:text-[#1F2933]">Voltar</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          key="step4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-[#6B7280] uppercase">Passo 3 de 4</h2>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2933]">Prioridade da semana</h1>
            <p className="text-[#6B7280]">O que você vai focar na área {area}?</p>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Ex: Lançar o novo site"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3E805F] focus:border-transparent"
              autoFocus
            />
            {areaSuggestions[area] && (
              <div className="flex flex-wrap gap-2 mt-2">
                {areaSuggestions[area].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setPriority(suggestion)}
                    className="text-sm bg-[#D1D5DB]/50 text-[#4B5563] px-4 py-2 rounded-full hover:bg-[#D1D5DB] hover:text-[#1F2933] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-3 pt-4">
            <button 
              onClick={handleNext}
              disabled={!priority.trim()}
              className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
            <button onClick={handleBack} className="w-full text-center text-[#6B7280] underline hover:text-[#1F2933]">Voltar</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          key="step5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-[#6B7280] uppercase">Passo 4 de 4</h2>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2933]">Critério de término</h1>
            <p className="text-[#6B7280]">Como você saberá que concluiu essa prioridade?</p>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Ex: Site publicado e 100 acessos"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3E805F] focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="space-y-3 pt-4">
            <button 
              onClick={handleNext}
              disabled={!criteria.trim()}
              className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Revisar semana
            </button>
            <button onClick={handleBack} className="w-full text-center text-[#6B7280] underline hover:text-[#1F2933]">Voltar</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <motion.div 
        key="step6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2933]">Sua semana está pronta</h1>
          <p className="text-[#6B7280]">Revise sua prioridade antes de confirmar.</p>
        </div>

        <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Área</h3>
            <p className="text-[#1F2933] font-medium">{area}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Prioridade</h3>
            <p className="text-[#1F2933] font-bold text-lg">{priority}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Critério de término</h3>
            <p className="text-[#1F2933] font-medium">{criteria}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Intenção</h3>
            <p className="text-[#1F2933] font-medium italic">"{intention}"</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors shadow-sm"
          >
            Confirmar ciclo
          </button>
          <button onClick={handleBack} className="w-full text-center text-[#6B7280] underline hover:text-[#1F2933]">Voltar e editar</button>
        </div>
      </motion.div>
    </div>
  );
}

function CicloIniciado({ data }: { data: PriorityData | null }) {
  const navigate = useNavigate();

  if (!data) {
    return <Navigate to="/definir-semana" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[#3E805F]">Ciclo iniciado</h2>
          <p className="text-[#6B7280] text-lg">Sua prioridade da semana é:</p>
        </div>
        
        <p className="text-4xl font-black leading-tight text-[#1F2933]">{data.priority}</p>
        
        <p className="text-[#6B7280] font-medium">Agora tudo o resto entra em modo manutenção.</p>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors mt-8"
        >
          Começar execução
        </button>
      </motion.div>
    </div>
  );
}

function Checkin({ onSave, checkins }: { onSave: (data: CheckinData) => void, checkins: CheckinData[] }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'reasons' | 'saved'>('initial');
  const [isEditing, setIsEditing] = useState(false);

  const todayCheckin = checkins.find(c => {
    const d1 = new Date(c.date);
    const d2 = new Date();
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  });

  const handleAvancei = () => {
    onSave({ date: new Date().toISOString(), status: 'AVANCEI' });
    setStep('saved');
    setIsEditing(false);
  };

  const handleEvitei = () => {
    setStep('reasons');
  };

  const handleSaveReason = (selectedReason: string) => {
    onSave({ date: new Date().toISOString(), status: 'EVITEI', reason: selectedReason });
    setStep('saved');
    setIsEditing(false);
  };

  if (step === 'saved') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center text-[#3E805F]"
          >
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-[#3E805F]">Check-in registrado</h2>
          <p className="text-[#6B7280] text-lg">Continue avançando.</p>
          <div className="inline-block px-4 py-2 rounded-full bg-[#D1D5DB]/30 text-[#374151] font-bold uppercase tracking-wider text-sm">
            Status: {todayCheckin?.status}
          </div>
          <button 
            onClick={() => {
              setIsEditing(true);
              setStep('initial');
            }}
            className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors mt-4"
          >
            Alterar check-in de hoje
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors mt-2"
          >
            Voltar ao dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (todayCheckin && !isEditing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center text-[#3E805F]">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#3E805F]">Check-in registrado</h2>
          <p className="text-[#6B7280] text-lg">Continue avançando.</p>
          <div className="inline-block px-4 py-2 rounded-full bg-[#D1D5DB]/30 text-[#374151] font-bold uppercase tracking-wider text-sm">
            Status: {todayCheckin.status}
          </div>
          <button 
            onClick={() => {
              setIsEditing(true);
              setStep('initial');
            }}
            className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors mt-4"
          >
            Alterar check-in de hoje
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors mt-2"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === 'reasons') {
    const reasons = ['excesso', 'dúvida', 'cansaço', 'perfeccionismo', 'outro'];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">O que atrapalhou?</h2>
          </div>
          <div className="space-y-3">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => handleSaveReason(r)}
                className="w-full bg-white border border-[#D1D5DB] text-[#374151] py-4 px-6 rounded-xl font-medium text-lg hover:border-[#3E805F] hover:text-[#1F2933] transition-colors capitalize"
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={() => setStep('initial')} className="w-full text-center text-[#6B7280] underline mt-4 hover:text-[#1F2933]">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Check-in diário</h2>
          <p className="text-[#6B7280]">Hoje você avançou ou evitou?</p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={handleAvancei} 
            className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors"
          >
            AVANCEI
          </button>
          <button 
            onClick={handleEvitei} 
            className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors"
          >
            EVITEI
          </button>
          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full text-center text-[#6B7280] underline pt-4 hover:text-[#1F2933] block mx-auto"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ data, checkins, history, onConcluir, onSaveCheckin }: { data: PriorityData | null, checkins: CheckinData[], history: PriorityData[], onConcluir: () => void, onSaveCheckin: (data: CheckinData) => void }) {
  const navigate = useNavigate();
  const [showConcluida, setShowConcluida] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [finalCheckinsCount, setFinalCheckinsCount] = useState(0);
  const [checkinStep, setCheckinStep] = useState<'initial' | 'reasons' | 'saved'>('initial');
  const [isEditing, setIsEditing] = useState(false);

  const completedCyclesCount = history.filter(cycle => cycle.status === 'concluído').length;

  const handleAvancei = () => {
    onSaveCheckin({ date: new Date().toISOString(), status: 'AVANCEI' });
    setCheckinStep('saved');
    setIsEditing(false);
  };

  const handleEvitei = () => {
    setCheckinStep('reasons');
  };

  const handleSaveReason = (selectedReason: string) => {
    onSaveCheckin({ date: new Date().toISOString(), status: 'EVITEI', reason: selectedReason });
    setCheckinStep('saved');
    setIsEditing(false);
  };

  if (showConcluida) {
    let message = "Você manteve o foco no que realmente importa.";
    let colorHex = "#3E805F";
    let buttonClass = "bg-[#3E805F] hover:bg-[#2D6046]";
    let Icon = CheckCircle2;

    if (finalCheckinsCount <= 2) {
      message = "Você iniciou o ciclo. Continue avançando.";
      colorHex = "#D64545";
      buttonClass = "bg-[#D64545] hover:bg-[#B83B3B]";
      Icon = RotateCcw;
    } else if (finalCheckinsCount <= 5) {
      message = "Você avançou. A consistência está sendo construída.";
      colorHex = "#E6A23C";
      buttonClass = "bg-[#E6A23C] hover:bg-[#C98D34]";
      Icon = TrendingUp;
    }

    const progressPercentage = (finalCheckinsCount / 7) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex justify-center"
            style={{ color: colorHex }}
          >
            <Icon size={80} strokeWidth={1.5} />
          </motion.div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: colorHex }}>Semana concluída</h2>
            <p className="text-xl font-bold text-[#1F2933]">{message}</p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-[#E5E7EB] rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="h-3 rounded-full"
                style={{ backgroundColor: colorHex }}
              />
            </div>
            <p className="text-sm font-bold text-[#4B5563] uppercase tracking-wider text-right">
              {finalCheckinsCount} de 7 check-ins
            </p>
          </div>

          <p className="text-[#6B7280] text-lg font-medium">Cada ciclo fechado fortalece sua disciplina.</p>
          <button 
            onClick={() => {
              setShowConcluida(false);
              navigate('/definir-semana');
            }} 
            className={`w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors mt-8 ${buttonClass}`}
          >
            Iniciar novo ciclo
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-3 text-center">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Disciplina acumulada</h3>
            {completedCyclesCount === 0 ? (
              <p className="text-[#1F2933] font-medium">Você ainda não concluiu nenhum ciclo.</p>
            ) : (
              <p className="text-2xl font-bold text-[#3E805F]">{completedCyclesCount} {completedCyclesCount === 1 ? 'ciclo concluído' : 'ciclos concluídos'}</p>
            )}
          </div>
          
          <div className="space-y-6">
            <p className="text-[#6B7280] text-lg">Você ainda não iniciou um novo ciclo.</p>
            <button 
              onClick={() => navigate('/definir-semana')}
              className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors"
            >
              Iniciar nova semana
            </button>
            <button 
              onClick={() => navigate('/historico')}
              className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors"
            >
              Ver histórico
            </button>
          </div>
        </div>
      </div>
    );
  }

  const uniqueCheckins = checkins.reduce((acc, current) => {
    const dateStr = new Date(current.date).toDateString();
    if (!acc.find(c => new Date(c.date).toDateString() === dateStr)) {
      acc.push(current);
    }
    return acc;
  }, [] as CheckinData[]);

  const progressCount = Math.min(uniqueCheckins.length, 7);
  const progressPercentage = (progressCount / 7) * 100;

  if (showSummary && data) {
    const totalAvancei = uniqueCheckins.filter(c => c.status === 'AVANCEI').length;
    const totalEvitei = uniqueCheckins.filter(c => c.status === 'EVITEI').length;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2933]">Resumo da semana</h2>
            <p className="text-[#6B7280] font-medium">Revisão do seu ciclo atual</p>
          </div>

          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Prioridade da semana</h3>
              <p className="text-xl font-bold text-[#1F2933]">{data.priority}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#D1D5DB]/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#4B5563]">Total de check-ins</span>
                <span className="text-sm font-bold text-[#1F2933]">{progressCount}/7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#4B5563]">Dias que avançou</span>
                <span className="text-sm font-bold text-[#3E805F]">{totalAvancei}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#4B5563]">Dias que evitou</span>
                <span className="text-sm font-bold text-[#EF4444]">{totalEvitei}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-3 text-center">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Disciplina acumulada</h3>
            <p className="text-2xl font-bold text-[#3E805F]">{completedCyclesCount} {completedCyclesCount === 1 ? 'ciclo concluído' : 'ciclos concluídos'}</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => {
                setFinalCheckinsCount(progressCount);
                onConcluir();
                setShowSummary(false);
                setShowConcluida(true);
              }}
              className="w-full bg-[#3E805F] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#2D6046] transition-colors shadow-sm"
            >
              Confirmar conclusão
            </button>
            <button 
              onClick={() => setShowSummary(false)}
              className="w-full text-center text-[#6B7280] underline pt-2 hover:text-[#1F2933] block mx-auto"
            >
              Voltar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const weekDays = [
    { label: 'Seg', dayIndex: 1 },
    { label: 'Ter', dayIndex: 2 },
    { label: 'Qua', dayIndex: 3 },
    { label: 'Qui', dayIndex: 4 },
    { label: 'Sex', dayIndex: 5 },
    { label: 'Sab', dayIndex: 6 },
    { label: 'Dom', dayIndex: 0 },
  ];

  const getCheckinForDay = (dayIndex: number) => {
    return uniqueCheckins.find(c => new Date(c.date).getDay() === dayIndex);
  };

  const todayCheckin = uniqueCheckins.find(c => {
    const d1 = new Date(c.date);
    const d2 = new Date();
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-[#3E805F] text-white rounded-2xl p-8 text-center shadow-md space-y-4">
          <h2 className="text-xs font-bold tracking-widest text-white/70 uppercase">Prioridade da semana</h2>
          <p className="text-3xl font-black leading-tight">{data.priority}</p>
          {data.intention && (
            <div className="pt-2 border-t border-white/20">
              <p className="text-sm font-medium text-white/80 italic">"{data.intention}"</p>
            </div>
          )}
          <p className="text-white/90 font-medium pt-2">Isso é o que importa agora.</p>
        </div>

        <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D1D5DB]/50 pb-4">
            <div>
              <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Área</h3>
              <span className="px-3 py-1 bg-[#D1D5DB]/30 text-[#374151] text-xs font-semibold rounded-full uppercase tracking-wider">
                {data.area}
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Status</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F2933]">
                {data.status || 'em andamento'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Critério de Término</h3>
            <p className="text-[#374151]">{data.completionCriteria}</p>
          </div>

          <div className="pt-4 border-t border-[#D1D5DB]/50">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-semibold text-[#1F2933]">Progresso</h3>
              <span className="text-sm font-medium text-[#6B7280]">Check-ins da semana: {progressCount}/7</span>
            </div>
            <div className="w-full bg-[#D1D5DB] rounded-full h-2.5 mb-6">
              <div 
                className="bg-[#3E805F] h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              {weekDays.map(({ label, dayIndex }) => {
                const checkin = getCheckinForDay(dayIndex);
                let bgColor = 'bg-[#D1D5DB]';
                let textColor = 'text-transparent';
                let icon = null;

                if (checkin) {
                  if (checkin.status === 'AVANCEI') {
                    bgColor = 'bg-[#3E805F]';
                    textColor = 'text-white';
                    icon = (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    );
                  } else {
                    bgColor = 'bg-[#1F2933]';
                    textColor = 'text-white';
                    icon = (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    );
                  }
                }

                return (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
                      {icon}
                    </div>
                    <span className="text-[10px] font-semibold text-[#6B7280] uppercase">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#1F2933] text-center">Check-in do dia</h3>
          
          {checkinStep === 'saved' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 text-center py-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center text-[#3E805F]"
              >
                <CheckCircle2 size={40} strokeWidth={1.5} />
              </motion.div>
              <p className="text-[#3E805F] font-bold text-lg">Check-in registrado</p>
              <div className="inline-block px-3 py-1 bg-[#D1D5DB]/30 text-[#374151] text-xs font-bold rounded-full uppercase tracking-wider">
                Status: {todayCheckin?.status}
              </div>
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCheckinStep('initial');
                }}
                className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-3 px-4 rounded-xl font-semibold hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors mt-2"
              >
                Alterar check-in de hoje
              </button>
            </motion.div>
          ) : todayCheckin && !isEditing ? (
            <div className="space-y-3 text-center py-2">
              <div className="flex justify-center text-[#3E805F]">
                <CheckCircle2 size={40} strokeWidth={1.5} />
              </div>
              <p className="text-[#3E805F] font-bold text-lg">Check-in registrado</p>
              <div className="inline-block px-3 py-1 bg-[#D1D5DB]/30 text-[#374151] text-xs font-bold rounded-full uppercase tracking-wider">
                Status: {todayCheckin.status}
              </div>
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCheckinStep('initial');
                }}
                className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-3 px-4 rounded-xl font-semibold hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors mt-2"
              >
                Alterar check-in de hoje
              </button>
            </div>
          ) : checkinStep === 'initial' ? (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-[#4B5563] font-medium">Você ainda não registrou seu check-in de hoje.</p>
                <p className="text-[#6B7280] text-sm">Hoje você avançou ou evitou?</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleAvancei} 
                  className="flex-1 bg-[#3E805F] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#2D6046] transition-colors"
                >
                  AVANCEI
                </button>
                <button 
                  onClick={handleEvitei} 
                  className="flex-1 bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-3 px-4 rounded-xl font-semibold hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors"
                >
                  EVITEI
                </button>
              </div>
              {isEditing && (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full text-center text-[#6B7280] underline text-sm pt-2 hover:text-[#1F2933] block mx-auto"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          ) : checkinStep === 'reasons' ? (
            <div className="space-y-4">
              <p className="text-[#4B5563] text-center">O que atrapalhou?</p>
              <div className="grid grid-cols-2 gap-2">
                {['excesso', 'dúvida', 'cansaço', 'perfeccionismo', 'outro'].map(r => (
                  <button
                    key={r}
                    onClick={() => handleSaveReason(r)}
                    className="w-full bg-[#F4F5F2] border border-[#D1D5DB] text-[#374151] py-2 px-3 rounded-lg font-medium hover:bg-[#E5E7EB] hover:border-[#9CA3AF] transition-colors capitalize text-sm"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={() => setCheckinStep('initial')} className="w-full text-center text-[#6B7280] underline text-sm pt-2 hover:text-[#1F2933]">
                Voltar
              </button>
            </div>
          ) : null}
        </div>

        <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm space-y-3 text-center">
          <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Disciplina acumulada</h3>
          {completedCyclesCount === 0 ? (
            <p className="text-[#1F2933] font-medium">Você ainda não concluiu nenhum ciclo.</p>
          ) : (
            <p className="text-2xl font-bold text-[#3E805F]">{completedCyclesCount} {completedCyclesCount === 1 ? 'ciclo concluído' : 'ciclos concluídos'}</p>
          )}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/checkin')}
            className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors"
          >
            Página de check-in
          </button>

          <button 
            onClick={() => navigate('/historico')}
            className="w-full bg-transparent border-2 border-[#D1D5DB] text-[#4B5563] py-4 px-6 rounded-xl font-semibold text-lg hover:border-[#9CA3AF] hover:text-[#1F2933] transition-colors"
          >
            Ver histórico
          </button>

          <button 
            onClick={() => setShowSummary(true)}
            className="w-full text-center text-[#6B7280] underline pt-2 block mx-auto hover:text-[#1F2933]"
          >
            Concluir semana
          </button>
        </div>
      </div>
    </div>
  );
}

function Historico({ history, activeCycleId }: { history: PriorityData[], activeCycleId?: string }) {
  const navigate = useNavigate();
  const pastCycles = history.filter(c => c.id !== activeCycleId);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F4F5F2] text-[#1F2933] p-6">
      <div className="max-w-md w-full space-y-8 mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Seu progresso</h2>
          <button onClick={() => navigate('/dashboard')} className="text-[#6B7280] underline hover:text-[#1F2933]">Voltar ao dashboard</button>
        </div>

        {pastCycles.length === 0 ? (
          <p className="text-[#6B7280] text-center py-12">Nenhum ciclo passado registrado ainda.</p>
        ) : (
          <div className="relative border-l-2 border-[#D1D5DB] ml-3 space-y-8">
            {pastCycles.map((cycle, idx) => {
              const cycleNumber = pastCycles.length - idx;
              const isCompleted = cycle.status === 'concluído';
              
              return (
                <div key={cycle.id || idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-[#F4F5F2] ${isCompleted ? 'bg-[#3E805F]' : 'bg-[#EF4444]'}`}></div>
                  <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Ciclo {cycleNumber}</h3>
                        <p className="text-lg font-bold text-[#1F2933]">{cycle.priority}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${isCompleted ? 'text-[#3E805F]' : 'text-[#EF4444]'}`}>
                        {isCompleted ? (
                          <><span>✔</span> <span>Concluído</span></>
                        ) : (
                          <><span>✖</span> <span>Não concluído</span></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [priorityData, setPriorityData] = useState<PriorityData | null>(() => {
    const saved = localStorage.getItem('6160_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [checkins, setCheckins] = useState<CheckinData[]>(() => {
    const saved = localStorage.getItem('6160_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<PriorityData[]>(() => {
    const saved = localStorage.getItem('6160_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (data: PriorityData) => {
    const newData = { ...data, id: Date.now().toString(), status: 'em andamento' as const };
    setPriorityData(newData);
    localStorage.setItem('6160_data', JSON.stringify(newData));

    const newHistory = [newData, ...history];
    setHistory(newHistory);
    localStorage.setItem('6160_history', JSON.stringify(newHistory));
  };

  const handleConcluir = () => {
    if (priorityData) {
      const id = priorityData.id;
      let updatedHistory;
      if (id) {
        updatedHistory = history.map(item => 
          item.id === id ? { ...item, status: 'concluído' as const } : item
        );
      } else {
        updatedHistory = [{ ...priorityData, id: Date.now().toString(), status: 'concluído' as const }, ...history];
      }
      setHistory(updatedHistory);
      localStorage.setItem('6160_history', JSON.stringify(updatedHistory));
    }

    setPriorityData(null);
    localStorage.removeItem('6160_data');
    setCheckins([]);
    localStorage.removeItem('6160_checkins');
  };

  const handleSaveCheckin = (data: CheckinData) => {
    const today = new Date(data.date);
    const existingIndex = checkins.findIndex(c => {
      const d = new Date(c.date);
      return d.getFullYear() === today.getFullYear() &&
             d.getMonth() === today.getMonth() &&
             d.getDate() === today.getDate();
    });
    
    let newCheckins;
    if (existingIndex >= 0) {
      newCheckins = [...checkins];
      newCheckins[existingIndex] = data;
    } else {
      newCheckins = [...checkins, data];
    }

    setCheckins(newCheckins);
    localStorage.setItem('6160_checkins', JSON.stringify(newCheckins));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/definir-semana" element={<DefinirSemana onSave={handleSave} hasActiveCycle={!!priorityData} />} />
        <Route path="/ciclo-iniciado" element={<CicloIniciado data={priorityData} />} />
        <Route path="/dashboard" element={<Dashboard data={priorityData} checkins={checkins} history={history} onConcluir={handleConcluir} onSaveCheckin={handleSaveCheckin} />} />
        <Route path="/checkin" element={<Checkin onSave={handleSaveCheckin} checkins={checkins} />} />
        <Route path="/historico" element={<Historico history={history} activeCycleId={priorityData?.id} />} />
      </Routes>
    </BrowserRouter>
  );
}
