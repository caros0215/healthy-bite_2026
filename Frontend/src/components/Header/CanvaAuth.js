import { randomBytes } from 'crypto';

/**
 * Genera valores PKCE (Proof Key for Code Exchange) para OAuth 2.0
 * @returns {Promise<{codeVerifier: string, codeChallenge: string}>} 
 */
export async function generatePKCE() {
  try {
    // Generar un code verifier aleatorio
    const codeVerifier = randomBytes(32).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Crear un code challenge a partir del code verifier
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    // Convertir el digest a base64-url
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return {
      codeVerifier,
      codeChallenge: base64Digest
    };
  } catch (error) {
    console.error('Error al generar PKCE:', error);
    throw error;
  }
}

/**
 * Intercambia un código de autorización por un token de acceso 
 * @param {string} code Código de autorización recibido de Canva
 * @param {string} codeVerifier Code verifier generado previamente
 * @returns {Promise<object>} Respuesta con el token de acceso
 */
export async function exchangeCodeForToken(code, codeVerifier) {
  const clientId = "OC-AZbHRDPO55sD";
  const redirectUri = "http://127.0.0.1:5000/oauth/redirect";
  
  try {
    const response = await fetch('http://localhost:5000/api/canva/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        client_id: clientId,
        redirect_uri: redirectUri,
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error al intercambiar código: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en el intercambio de tokens:', error);
    throw error;
  }
}