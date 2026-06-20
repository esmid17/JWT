import Sentry from '../src/instrument.js';

export class ResourceController {
    /**
     * Simula un recurso privado del Microservicio Alpha.
     */
    static getAlphaPrivateData(req, res) {
        const user = req.user || null;
        // Simular un fallo operacional cuando se solicita explícitamente
        if (req.query.fail === 'true' || req.headers['x-simulate-fail'] === '1') {
            // Error operacional: debe aparecer en Sentry
            throw new Error('Conexión perdida con la BDD');
        }

        return res.json({ message: 'Access granted to service-alpha private resource', user });
    }

    /**
     * Simula un recurso privado del Microservicio Beta.
     */
    static getBetaPrivateData(req, res) {
        const user = req.user || null;
        try {
            // Logica normal del endpoint
            return res.json({ message: 'Access granted to service-beta private resource', user });
        } catch (err) {
            // Captura explícita y envío de contexto a Sentry
            const userId = user && (user.sub || user.id || user.email) ? (user.sub || user.id || user.email) : 'unknown';
            Sentry.captureException(err, {
                tags: {
                    service: 'service-beta',
                    userId
                },
                extra: {
                    // Evitar incluir datos sensibles; enviar únicamente campos no sensibles
                    user: { id: userId }
                }
            });

            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
