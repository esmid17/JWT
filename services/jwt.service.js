import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export class JwtService {
    /**
     * Firma un token JWT basándose en el algoritmo configurado.
     * @param {Object} payload - Los datos del usuario a incluir en el token.
     * @returns {string} El token JWT generado.
     */
    static signToken(payload) {
        const alg = (config.ALGORITHM || 'HS256').toUpperCase();

        // Construir payload mínimo requerido: sub, name, exp (1 minuto)
        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            sub: payload.sub || payload.id || 'unknown',
            name: payload.name || payload.username || 'unknown',
            exp: now + 60 // 1 minuto
        };

        if (alg === 'RS256') {
            if (!config.PRIVATE_KEY) throw new Error('PRIVATE_KEY no configurada en env');
            return jwt.sign(tokenPayload, config.PRIVATE_KEY, { algorithm: 'RS256' });
        }

        // Por defecto HS256
        if (!config.JWT_SECRET) throw new Error('JWT_SECRET no configurado en env');
        return jwt.sign(tokenPayload, config.JWT_SECRET, { algorithm: 'HS256' });
    }

    /**
     * Verifica un token JWT basándose en el algoritmo configurado.
     * @param {string} token - El token JWT a verificar.
     * @returns {Object|null} El payload decodificado o null si es inválido.
     */
    static verifyToken(token) {
        const alg = (config.ALGORITHM || 'HS256').toUpperCase();
        let key;
        if (alg === 'RS256') {
            if (!config.PUBLIC_KEY) throw new Error('PUBLIC_KEY no configurada en env');
            key = config.PUBLIC_KEY;
        } else {
            if (!config.JWT_SECRET) throw new Error('JWT_SECRET no configurado en env');
            key = config.JWT_SECRET;
        }

        // Permitimos que jwt.verify lance errores y el middleware los maneje.
        const decoded = jwt.verify(token, key, { algorithms: [alg] });
        return decoded;
    }
}
