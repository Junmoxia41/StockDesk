/**
 * AIService — fachada del Asistente de IA.
 * Stock Desk Application
 *
 * P3 (auditoría de producción): centraliza el acceso a la configuración y
 * el estado del Asistente de IA (definido en js/modules/ai-assistant.js,
 * ai-chat.js y ai-advanced.js), para que otras partes de la app (por
 * ejemplo Configuración) no necesiten conocer los detalles internos de
 * `AIAssistant.config`.
 *
 * IMPORTANTE (honestidad, ver docs/AI.md): la API Key se guarda en
 * localStorage y las llamadas a GLM/ZhipuAI se hacen directamente desde
 * el navegador del usuario. Este servicio no cambia ese comportamiento,
 * solo ordena el acceso a él.
 */
window.AIService = {
  /** true si el usuario configuró una API Key de IA. */
  isConfigured() {
    return !!(Store.get('stockdesk_ai_apikey') || '').trim();
  },

  /** Guarda la API Key y sincroniza el módulo AIAssistant si está cargado. */
  setApiKey(key) {
    Store.set('stockdesk_ai_apikey', key);
    if (typeof AIAssistant !== 'undefined') {
      AIAssistant.config.apiKey = key;
    }
  },

  /** Devuelve la API Key guardada (vacío si no hay ninguna). */
  getApiKey() {
    return Store.get('stockdesk_ai_apikey') || '';
  },

  /** Elimina la API Key guardada (vuelve al modo offline/local). */
  clearApiKey() {
    this.setApiKey('');
  },

  /**
   * true si el módulo del asistente (ai-assistant.js) llegó a cargar.
   * Esta comprobación existe porque, hasta esta auditoría, los tres
   * archivos de IA no estaban enlazados en index.html y `AIAssistant` era
   * `undefined` en producción (ver docs/PRODUCTION-AUDIT.md, hallazgo S9).
   */
  isAvailable() {
    return typeof AIAssistant !== 'undefined';
  },

  /** Envía un mensaje al asistente (requiere que el módulo esté cargado). */
  sendMessage(text) {
    if (!this.isAvailable()) {
      console.warn('AIService.sendMessage: AIAssistant no está cargado.');
      return Promise.resolve(null);
    }
    return AIAssistant.sendMessage(text);
  }
};
