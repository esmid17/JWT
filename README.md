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