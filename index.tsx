import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Sistema: Iniciando montagem do Command Center...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("ERRO FATAL: Elemento #root não encontrado. A interface não pode ser renderizada.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Sistema: React montado com sucesso. Interface ativa.");
  } catch (err: any) {
    console.error("Erro durante a montagem do React:", err);
    rootElement.innerHTML = `
      <div style="background: #000; color: #ff4444; padding: 40px; font-family: 'JetBrains Mono', monospace; height: 100vh;">
        <h1 style="font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px;">CRITICAL_SYSTEM_FAILURE</h1>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">Falha ao carregar os módulos da interface gráfica.</p>
        <pre style="background: #111; padding: 20px; border-radius: 8px; margin-top: 20px; overflow: auto;">${err.stack || err.message}</pre>
        <p style="font-size: 12px; color: #555; margin-top: 20px;">Verifique o console (F12) para mais detalhes.</p>
      </div>
    `;
  }
}