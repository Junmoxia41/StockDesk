/**
 * AuthService — fachada de autenticación y sesión (LOCAL, sin backend).
 * Stock Desk Application
 *
 * P3 (auditoría de producción): antes de este servicio, `router.js` y
 * `components-layout.js` leían `Store.get(Store.KEYS.USER)` directamente
 * en varios lugares. Este servicio centraliza esa lectura para que, si en
 * el futuro se agrega un backend real de autenticación (ver
 * docs/ARCHITECTURE.md, "Backend futuro"), solo haya un punto de cambio.
 *
 * IMPORTANTE (honestidad, ver docs/SECURITY.md):
 * - Esto NO es autenticación de servidor. La "sesión" es un objeto en
 *   localStorage que cualquier persona con acceso a DevTools puede leer o
 *   modificar. No hay tokens firmados ni verificación en un servidor.
 * - El hashing de contraseñas (SHA-256 vía AuthUtils) reduce el riesgo de
 *   contraseñas en texto plano, pero no sustituye un backend con
 *   bcrypt/Argon2 y limitación de intentos real.
 */
window.AuthService = {
  /** Devuelve el usuario de la sesión actual, o null si no hay sesión. */
  getCurrentUser() {
    return Store.get(Store.KEYS.USER) || null;
  },

  /** true si hay una sesión local activa (`loggedIn: true`). */
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!(user && user.loggedIn);
  },

  /** Rol de la sesión actual, o 'guest' si no hay sesión. */
  getCurrentRole() {
    const user = this.getCurrentUser();
    return user?.role || 'guest';
  },

  /**
   * Reemplaza el usuario de la sesión actual (fusiona con el existente).
   * Usado, por ejemplo, tras un cambio de contraseña para mantener la
   * sesión coherente con el nuevo hash guardado en Store.KEYS.USERS.
   */
  updateCurrentUser(patch) {
    const current = this.getCurrentUser() || {};
    const updated = { ...current, ...patch };
    Store.set(Store.KEYS.USER, updated);
    return updated;
  },

  /**
   * Establece la sesión activa a partir de un usuario recién autenticado
   * (reemplaza cualquier sesión previa, sin fusionar campos de un usuario
   * anterior). Usado por el flujo de login.
   */
  login(user) {
    Store.set(Store.KEYS.USER, { ...user });
    return user;
  },

  /** Cierra la sesión local (borra Store.KEYS.USER). */
  logout() {
    Store.remove(Store.KEYS.USER);
  },

  /** Hash de contraseña (delegado a AuthUtils, SHA-256 vía crypto.subtle). */
  hashPassword(password) {
    return AuthUtils.hashPassword(password);
  },

  /** Verifica una contraseña contra su hash (o texto plano heredado). */
  verifyPassword(password, stored) {
    return AuthUtils.verifyPassword(password, stored);
  }
};
