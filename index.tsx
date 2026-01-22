import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Iniciando carregamento do módulo principal...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Erro crítico: Elemento #root não encontrado no DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log("React montado com sucesso.");
  } catch (err) {
    console.error("Erro durante a montagem do React:", err);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: monospace;">Erro ao carregar app: ${err.message}</div>`;
  }
}