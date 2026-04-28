import React, { createContext, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Area, CheckinStatus, Checkin, AppState, Cycle } from '../types';

interface ProtocoloContextData {
  state: AppState;
  startCycle: (cycleData: Omit<Cycle, 'id' | 'startDate' | 'status' | 'checkins'>) => void;
  addCheckin: (date: string, status: CheckinStatus, reason?: string) => void;
  finishActiveCycle: () => void;
  getTodayStr: () => string;
}

const ProtocoloContext = createContext<ProtocoloContextData | undefined>(undefined);

const STORAGE_KEY = 'protocolo6160_data';

const getInitialState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
  }
  return {
    activeCycle: null,
    history: [],
  };
};

export const ProtocoloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

  const startCycle = (cycleData: Omit<Cycle, 'id' | 'startDate' | 'status' | 'checkins'>) => {
    if (state.activeCycle) {
      return; // Already active cycle
    }

    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      startDate: getTodayStr(),
      status: 'EM_ANDAMENTO',
      checkins: {},
      ...cycleData
    };

    setState(prev => ({
      ...prev,
      activeCycle: newCycle
    }));
  };

  const addCheckin = (date: string, status: CheckinStatus, reason?: string) => {
    setState(prev => {
      if (!prev.activeCycle) return prev;

      return {
        ...prev,
        activeCycle: {
          ...prev.activeCycle,
          checkins: {
            ...prev.activeCycle.checkins,
            [date]: { date, status, reason }
          }
        }
      };
    });
  };

  const finishActiveCycle = () => {
    setState(prev => {
      if (!prev.activeCycle) return prev;
      
      const finishedCycle: Cycle = {
        ...prev.activeCycle,
        status: 'CONCLUIDO'
      };

      return {
        ...prev,
        activeCycle: null,
        history: [...prev.history, finishedCycle]
      };
    });
  };

  return (
    <ProtocoloContext.Provider value={{ state, startCycle, addCheckin, finishActiveCycle, getTodayStr }}>
      {children}
    </ProtocoloContext.Provider>
  );
};

export const useProtocolo = () => {
  const context = useContext(ProtocoloContext);
  if (context === undefined) {
    throw new Error('useProtocolo must be used within a ProtocoloProvider');
  }
  return context;
};
