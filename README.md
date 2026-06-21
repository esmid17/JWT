# JWT

## Refresh Tokens (Respuesta de la práctica)

1) ¿Cómo un Refresh Token mejoraría la experiencia del usuario sin comprometer la seguridad, dado que los JWT expiran en 1 minuto?

- Un Refresh Token permite emitir access tokens de corta duración (ej. 1 minuto) y renovarlos sin que el usuario vuelva a autenticarse, reduciendo la ventana de exposición en caso de filtración del access token.
- El flujo típico es: cliente usa access token para llamadas; cuando expira, usa el Refresh Token para solicitar un nuevo access token al servidor de identidad. El Refresh Token se valida en el servidor y, si es válido, se emite un nuevo access token (y opcionalmente se rota el refresh token).

2) ¿Dónde almacenar y gestionar el ciclo de vida del Refresh Token según buenas prácticas?

- Almacenamiento: guardar el Refresh Token en una cookie segura (atributos `HttpOnly`, `Secure`, `SameSite=Strict`/`Lax` según necesidades) para mitigar riesgos XSS.
- Gestión: el servidor debe mantener control sobre el ciclo de vida (revocación, rotación, lista negra opcional). El cliente no debe manejar lógicamente el refresh salvo invocarlo cuando el access token expire.
- Nunca almacenar Refresh Tokens en `localStorage` o `sessionStorage` si se pretende proteger contra XSS; usar cookies seguras y CSRF mitigations cuando corresponda.

---

## Observabilidad y Sentry (Práctica 2)

Instrucciones para instrumentar el proyecto con Sentry y verificar la captura de errores:

- Crear un proyecto en https://sentry.io para la plataforma **Node.js / Express** y copiar el `DSN`.
- Añadir localmente un archivo `.env` (NO comitear) con al menos las variables:

	- `PORT=3000`
	- `JWT_SECRET=...`
	- `SENTRY_DSN=tu_dsn_aqui`
	- `NODE_ENV=development`

- Flujo Git recomendado (hacer estos pasos en tu máquina):

```bash
git checkout main
git pull origin main
git checkout -b feature/observabilidad-sentry
```

- Dependencias: se añadió `@sentry/node` y se creó `src/instrument.js` que inicializa Sentry lo más pronto posible.
- En `index.js` la importación de `src/instrument.js` se realiza antes de cargar Express; los handlers de Sentry se registran adecuadamente.

Cómo probar los endpoints y diferenciar errores:

- Error operacional (debe aparecer en Sentry):

	- Llamar a `/v1/service-alpha/private` con el parámetro `?fail=true` o el header `x-simulate-fail: 1`.

- Error lógico (no debe generar alerta crítica en Sentry):

	- Enviar un token expirado o malformado al mismo endpoint; el middleware responde `401` o `403` según corresponda.

- Captura explícita con contexto (tags/extra):

	- `service-beta` realiza `Sentry.captureException(err)` y añade `tags` y `extra` con `userId` (sin enviar datos sensibles).
