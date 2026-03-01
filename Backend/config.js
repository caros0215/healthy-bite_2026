// Este script debe estar en tu servidor backend
// Carga las variables del archivo .env
require('dotenv').config();

// Verifica si las variables de entorno están disponibles
console.log('Verificando variables de entorno para Canva:');
console.log('CANVA_CLIENT_ID disponible:', !!process.env.CANVA_CLIENT_ID);
console.log('CANVA_CLIENT_SECRET disponible:', !!process.env.CANVA_CLIENT_SECRET);
console.log('CANVA_REDIRECT_URI disponible:', !!process.env.CANVA_REDIRECT_URI);

// Si no están en las variables de entorno, usa los valores definidos manualmente
const config = {
  canva: {
    clientId: process.env.CANVA_CLIENT_ID || 'OC-AZbHRDPO55sD',
    clientSecret: process.env.CANVA_CLIENT_SECRET || 'cnvcaLYYTqea1Pxm_eFgRxKUthYMIiPYLJyGTow7ue1pqudg49a630ca',
    redirectUri: process.env.CANVA_REDIRECT_URI || 'http://localhost:3000/canva-callback'
  }
};

module.exports = config;