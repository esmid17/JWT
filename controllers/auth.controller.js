import { JwtService } from '../services/jwt.service.js';

export class AuthController {
    /**
     * Simula un servidor de autenticación que genera un token.
     */
    static async generateToken(req, res) {
        const { username, password } = req.body || {};

        // Simulación simple de autenticación
        if (!username || !password) return res.status(400).json({ message: 'username and password required' });

        // Credenciales simuladas: admin / password
        if (username === 'admin' && password === 'password') {
            const user = { sub: '1', name: 'Administrator' };
            try {
                const token = JwtService.signToken(user);
                return res.json({ token });
            } catch (err) {
                return res.status(500).json({ message: 'Error generating token', error: err.message });
            }
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    }
}
