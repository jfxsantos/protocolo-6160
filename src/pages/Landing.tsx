import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useProtocolo } from '../context/ProtocoloContext';
import { cn } from '../lib/utils';

export default function Landing() {
  const navigate = useNavigate();
  const { state } = useProtocolo();
  const [step, setStep] = useState(1);
  const [commitmentChecked, setCommitmentChecked] = useState(false);

  useEffect(() => {
    const isCompleted = localStorage.getItem('protocolo6160_onboarding') === 'true';
    if (isCompleted) {
      if (state.activeCycle) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/definir-semana', { replace: true });
      }
    }
  }, [navigate, state.activeCycle]);

  const handleNext = () => {
    if (step === 3) {
      localStorage.setItem('protocolo6160_onboarding', 'true');
      if (state.activeCycle) {
        navigate('/dashboard');
      } else {
        navigate('/definir-semana');
      }
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full items-center justify-center py-6">
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full animate-in fade-in slide-in-from-right-4 duration-500 pt-8 pb-12">
          <div className="space-y-2 mb-10 text-center">
            <h1 className="text-4xl font-light tracking-tight text-brand-primary">Protocolo 6160</h1>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase block">
              O Sistema de Disciplina Semanal
            </span>
          </div>

          <div className="space-y-6 text-gray-700 text-[17px] leading-relaxed mx-auto text-left w-full px-2">
            <p className="font-medium text-brand-text">Se você chegou até aqui, algo já começou a mudar.</p>
            
            <div className="space-y-1 text-gray-500">
              <p>Talvez você esteja cansado.<br/>
              Talvez confuso.<br/>
              Talvez só precise de direção.</p>
            </div>

            <p className="font-medium">E tudo bem.</p>

            <div className="space-y-1">
              <p>O Protocolo 6160 existe para uma coisa:</p>
              <p className="font-medium text-brand-primary">Te fazer voltar a executar o que realmente importa.</p>
            </div>

            <div className="space-y-1 text-gray-500">
              <p>Sem excesso.<br/>
              Sem confusão.<br/>
              Um dia por vez.</p>
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="mt-12 w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase flex items-center justify-center gap-2"
            style={{ backgroundColor: '#3E805F' }}
          >
            Começar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full animate-in fade-in slide-in-from-right-4 duration-500 pt-8 pb-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-light tracking-tight text-brand-primary">Simples de usar</h2>
          </div>

          <div className="space-y-8 text-gray-700 text-lg leading-relaxed mx-auto text-left w-full px-2">
            <div className="space-y-2 font-medium text-xl text-brand-text">
              <p>1 prioridade por semana</p>
              <p>1 check-in por dia</p>
              <p>7 dias de consistência</p>
            </div>
            
            <p className="text-2xl font-light text-brand-primary">Simples.</p>

            <div className="space-y-1 text-gray-500">
              <p>Você não precisa fazer tudo.</p>
              <p className="text-brand-text font-medium">Só precisa fazer o que importa.</p>
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="mt-12 w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase flex items-center justify-center gap-2"
            style={{ backgroundColor: '#3E805F' }}
          >
            Entendi
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full animate-in fade-in slide-in-from-right-4 duration-500 pt-8 pb-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light tracking-tight text-brand-primary">Antes de começar</h2>
          </div>

          <div className="space-y-6 text-gray-700 text-[17px] leading-relaxed mx-auto text-left w-full px-2">
            <div className="space-y-1">
              <p>Isso não é sobre motivação.</p>
              <p className="font-medium text-brand-text">É sobre decisão.</p>
            </div>

            <div className="space-y-2">
              <p>Se você continuar:</p>
              <div className="space-y-1 text-gray-600 pl-2 border-l-2 border-gray-200">
                <p>→ você vai perceber seus padrões</p>
                <p>→ vai ter dias sem vontade</p>
                <p>→ vai precisar agir mesmo assim</p>
              </div>
            </div>

            <p className="font-medium text-brand-text">Ninguém vai fazer por você.</p>

            <div className="space-y-1">
              <p>Então seja honesto:</p>
              <p className="font-medium text-brand-primary">Você está disposto a executar o que precisa ser feito?</p>
            </div>
            
            <label className="flex items-center gap-4 p-4 mt-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-gray-50 bg-white"
                  style={{ borderColor: commitmentChecked ? '#3E805F' : '#E5E7EB' }}>
              <div className={cn(
                "w-6 h-6 rounded border flex items-center justify-center transition-colors shrink-0",
                commitmentChecked ? "bg-brand-primary border-brand-primary" : "border-gray-300"
              )}>
                {commitmentChecked && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className={cn("text-base select-none leading-tight", commitmentChecked ? "font-medium text-brand-text" : "text-gray-600")}>
                Sim, eu assumo esse compromisso
              </span>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={commitmentChecked}
                onChange={(e) => setCommitmentChecked(e.target.checked)}
              />
            </label>
          </div>

          <button 
            disabled={!commitmentChecked}
            onClick={handleNext}
            className="mt-8 w-full py-5 rounded-2xl font-bold tracking-wide transition-all text-white shadow-lg active:scale-95 uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-sm"
            style={{ backgroundColor: '#3E805F' }}
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
