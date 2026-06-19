export class ResourceController {
    /**
     * Simula un recurso privado del Microservicio Alpha.
     */
    static getAlphaPrivateData(req, res) {
        const user = req.user || null;
        return res.json({ message: 'Access granted to service-alpha private resource', user });
    }

    /**
     * Simula un recurso privado del Microservicio Beta.
     */
    static getBetaPrivateData(req, res) {
        const user = req.user || null;
        return res.json({ message: 'Access granted to service-beta private resource', user });
    }
}
