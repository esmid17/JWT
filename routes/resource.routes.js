import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import Sentry from '../src/instrument.js';

const router = Router();

// TODO: Definir rutas protegidas usando authMiddleware.
// 1. GET /v1/service-alpha/private -> ResourceController.getAlphaPrivateData
// 2. GET /v1/service-beta/private -> ResourceController.getBetaPrivateData

router.get('/v1/service-alpha/private', authMiddleware, ResourceController.getAlphaPrivateData);
router.get('/v1/service-beta/private', authMiddleware, ResourceController.getBetaPrivateData);

// Ruta de depuración para forzar un evento en Sentry (no protegida)
router.get('/sentry-debug', (req, res) => {
	const eventId = Sentry.captureException(new Error('Prueba manual Sentry desde /sentry-debug'));
	return res.json({ eventId });
});

// Ruta de prueba que lanza una excepción no capturada para que el middleware de Sentry la recoja
router.get('/sentry-throw', (req, res) => {
	throw new Error('Simulated operational failure for Sentry (/sentry-throw)');
});

export default router;
