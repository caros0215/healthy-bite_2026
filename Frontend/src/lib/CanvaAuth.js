/**
 * Utilidades para la autenticación con Canva
 */

/**
 * Genera un string aleatorio para usar como code_verifier
 * @param {number} length - Longitud del string aleatorio
 * @returns {string} - String aleatorio
 */
function generateRandomString(length = 64) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  let text = ""

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

/**
 * Convierte un string a un ArrayBuffer
 * @param {string} str - String a convertir
 * @returns {ArrayBuffer} - ArrayBuffer resultante
 */
function stringToArrayBuffer(str) {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

/**
 * Convierte un ArrayBuffer a una string en base64url
 * @param {ArrayBuffer} buffer - ArrayBuffer a convertir
 * @returns {string} - String en base64url
 */
function bufferToBase64Url(buffer) {
  // Convertir el buffer a una cadena base64
  const bytes = new Uint8Array(buffer)
  const base64 = btoa(String.fromCharCode.apply(null, bytes))

  // Convertir base64 a base64url
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Genera un par de code_verifier y code_challenge para PKCE
 * @returns {Promise<{codeVerifier: string, codeChallenge: string}>} - Par de code_verifier y code_challenge
 */
export async function generatePKCE() {
  // Generar code_verifier - IMPORTANTE: Asegurarse de que tenga la longitud correcta (entre 43 y 128 caracteres)
  const codeVerifier = generateRandomString(64)

  // Generar code_challenge usando SHA-256
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest("SHA-256", data)

  // Convertir el digest a base64url
  const codeChallenge = bufferToBase64Url(digest)

  return { codeVerifier, codeChallenge }
}

/**
 * Verifica si hay un token de Canva válido
 * @returns {boolean} - true si hay un token válido, false en caso contrario
 */
export const hasValidCanvaToken = () => {
  const token = localStorage.getItem("canvaToken")
  const tokenDataStr = localStorage.getItem("canvaTokenData")

  if (!token || !tokenDataStr) {
    return false
  }

  try {
    const tokenData = JSON.parse(tokenDataStr)
    // Verificar si el token ha expirado
    if (tokenData.expires_at && tokenData.expires_at < Date.now()) {
      return false
    }
    return true
  } catch (e) {
    console.error("Error al verificar token de Canva:", e)
    return false
  }
}

/**
 * Verifica la validez del token con el servidor
 * @returns {Promise<boolean>} - true si el token es válido, false en caso contrario
 */
export const verifyCanvaToken = async () => {
  const token = localStorage.getItem("canvaToken")

  if (!token) {
    return false
  }

  try {
    const response = await fetch("http://localhost:5000/api/canva/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()
    return data.valid === true
  } catch (error) {
    console.error("Error al verificar token de Canva:", error)
    return false
  }
}

/**
 * Cierra la sesión de Canva
 */
export const logoutCanva = () => {
  localStorage.removeItem("canvaToken")
  localStorage.removeItem("canvaTokenData")
  localStorage.removeItem("canva_auth_state")
  localStorage.removeItem("canva_code_verifier")
}
