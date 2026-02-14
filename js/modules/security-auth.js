/**
 * Security Authentication Module
 * Stock Desk Application
 */

const SecurityAuth = {
    render() {
        const security = Store.security.get();

        return `
            <div class="space-y-6">
                <!-- 2FA Section -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            ${Components.icons.lock}
                            <h3 class="font-semibold text-slate-900">Autenticación de Dos Factores (2FA)</h3>
                        </div>
                        <span class="px-3 py-1 text-xs rounded-full ${security.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}">
                            ${security.twoFactorEnabled ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div class="p-5">
                        <p class="text-sm text-slate-600 mb-4">
                            Añade una capa extra de seguridad a tu cuenta requiriendo un código adicional al iniciar sesión.
                        </p>
                        <div class="flex flex-wrap gap-3">
                            ${security.twoFactorEnabled ? `
                                <button onclick="SecurityAuth.disable2FA()" 
                                        class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-lg transition">
                                    Desactivar 2FA
                                </button>
                                <button onclick="SecurityAuth.showRecoveryCodes()" 
                                        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg transition">
                                    Ver códigos de recuperación
                                </button>
                            ` : `
                                <button onclick="SecurityAuth.setup2FA()" 
                                        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition">
                                    Configurar 2FA
                                </button>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Password Section -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
                            ${Components.icons.edit} Cambiar Contraseña
                        </h3>
                    </div>
                    <div class="p-5">
                        <form onsubmit="SecurityAuth.changePassword(event)" class="space-y-4 max-w-md">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña actual</label>
                                <input type="password" id="current-pass" required
                                       class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
                                <input type="password" id="new-pass" required
                                       class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
                                <input type="password" id="confirm-pass" required
                                       class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                            </div>
                            <button type="submit" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition">
                                Actualizar Contraseña
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Lock Settings -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
                            ${Components.icons.warning} Bloqueo de Seguridad
                        </h3>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p class="font-medium text-slate-900">Bloqueo por intentos fallidos</p>
                                <p class="text-sm text-slate-500">Bloquear después de 5 intentos fallidos</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" ${security.lockOnFailure ? 'checked' : ''} 
                                       onchange="SecurityAuth.toggleLock(this.checked)" class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p class="font-medium text-slate-900">Encriptación de datos</p>
                                <p class="text-sm text-slate-500">Cifrar información sensible en almacenamiento</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" ${security.encryptionEnabled ? 'checked' : ''} 
                                       onchange="SecurityAuth.toggleEncryption(this.checked)" class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    setup2FA() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        Components.modal({
            title: 'Configurar 2FA',
            content: `
                <div class="text-center">
                    <div class="w-32 h-32 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <div class="text-center">
                            <p class="text-xs text-slate-500 mb-1">Código QR</p>
                            ${Components.icons.qrcode.replace('w-5 h-5', 'w-12 h-12 text-slate-400')}
                        </div>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">O ingresa este código manualmente:</p>
                    <p class="font-mono text-xl font-bold text-orange-600 bg-orange-50 py-2 px-4 rounded-lg">${code}</p>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Código de verificación</label>
                        <input type="text" id="verify-code" placeholder="000000" maxlength="6"
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-center text-xl tracking-widest">
                    </div>
                </div>
            `,
            confirmText: 'Activar 2FA',
            onConfirm: () => {
                Store.security.update({ twoFactorEnabled: true, twoFactorSecret: code });
                Store.security.addLog('2FA activado');
                Components.toast('2FA activado correctamente', 'success');
                Router.navigate('security');
            }
        });
    },

    disable2FA() {
        Components.modal({
            title: 'Desactivar 2FA',
            content: '<p>¿Estás seguro? Tu cuenta será menos segura sin autenticación de dos factores.</p>',
            confirmText: 'Desactivar',
            type: 'danger',
            onConfirm: () => {
                Store.security.update({ twoFactorEnabled: false });
                Store.security.addLog('2FA desactivado');
                Components.toast('2FA desactivado', 'warning');
                Router.navigate('security');
            }
        });
    },

    showRecoveryCodes() {
        const codes = ['A1B2C3', 'D4E5F6', 'G7H8I9', 'J0K1L2', 'M3N4O5'];
        Components.modal({
            title: 'Códigos de Recuperación',
            content: `
                <p class="text-sm text-slate-600 mb-4">Guarda estos códigos en un lugar seguro. Cada uno solo puede usarse una vez.</p>
                <div class="grid grid-cols-2 gap-2">
                    ${codes.map(c => `<code class="bg-slate-100 px-3 py-2 rounded text-center font-mono">${c}</code>`).join('')}
                </div>
            `,
            confirmText: 'Entendido',
            cancelText: 'Copiar todos'
        });
    },

    changePassword(e) {
        e.preventDefault();
        const newPass = document.getElementById('new-pass').value;
        const confirmPass = document.getElementById('confirm-pass').value;
        
        if (newPass !== confirmPass) {
            Components.toast('Las contraseñas no coinciden', 'error');
            return;
        }
        
        Store.security.addLog('Contraseña cambiada');
        Components.toast('Contraseña actualizada correctamente', 'success');
        e.target.reset();
    },

    toggleLock(enabled) {
        Store.security.update({ lockOnFailure: enabled });
        Store.security.addLog(enabled ? 'Bloqueo por intentos activado' : 'Bloqueo por intentos desactivado');
        Components.toast('Configuración actualizada', 'success');
    },

    toggleEncryption(enabled) {
        Store.security.update({ encryptionEnabled: enabled });
        Store.security.addLog(enabled ? 'Encriptación activada' : 'Encriptación desactivada');
        Components.toast('Configuración actualizada', 'success');
    }
};
