import './src/instrument.js';
import Sentry, { setupExpressErrorHandler } from './src/instrument.js';
import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import resourceRoutes from './routes/resource.routes.js';

const app = express();

// Sentry request/tracing handlers deben ir antes de las rutas
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Habilitar CORS para pruebas desde el front
app.use(cors());

// Servir archivos estáticos desde /public si necesitas una página de prueba
app.use(express.static('public'));

app.use(express.json());

// TODO: Montar las rutas.
// 1. Usar /auth para authRoutes.
// 2. Usar /api para resourceRoutes (o directamente en la raíz).

app.use('/auth', authRoutes);
app.use('/', resourceRoutes);

// Registrar el manejador de errores de Sentry justo después de las rutas
setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
  // res.sentry viene del handler de Sentry
  res.status(500).json({ errorId: res.sentry || null, message: 'Internal server error' });
});

app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
});
