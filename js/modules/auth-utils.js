/**
 * Auth Utils - hashing y verificación de contraseña (cliente)
 * NOTA: Esto NO es seguridad real como un backend, pero evita contraseñas en claro.
 */
window.AuthUtils = {
  async sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Guarda como: "sha256:<hex>"
  async hashPassword(password) {
    const hex = await this.sha256Hex(password);
    return `sha256:${hex}`;
  },

  // Soporta legacy (texto plano) por compatibilidad
  async verifyPassword(password, stored) {
    if (!stored) return false;

    // Hash moderno
    if (typeof stored === 'string' && stored.startsWith('sha256:')) {
      const hex = await this.sha256Hex(password);
      return stored === `sha256:${hex}`;
    }

    // Legacy (texto plano)
    return stored === password;
  }
};
