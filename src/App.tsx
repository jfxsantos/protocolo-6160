/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DefinirSemana from './pages/DefinirSemana';
import Dashboard from './pages/Dashboard';
import Checkin from './pages/Checkin';
import Historico from './pages/Historico';
import ConcluirSemana from './pages/ConcluirSemana';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/definir-semana" element={<DefinirSemana />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/concluir" element={<ConcluirSemana />} />
        </Routes>
      </main>
    </div>
  );
}

