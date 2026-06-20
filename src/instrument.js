import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

// Cargar variables de entorno lo antes posible
dotenv.config();

const dsn = process.env.SENTRY_DSN || '';
Sentry.init({
  dsn,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0
});

export default Sentry;

export function setupExpressErrorHandler(app) {
  // Registrar el manejador de errores de Sentry (debe ir después de las rutas y antes de middlewares de errores personalizados)
  app.use(Sentry.Handlers.errorHandler());
}
