import { writeFileSync } from 'fs';
import { generateKeyPairSync } from 'crypto';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

writeFileSync(new URL('../public.pem', import.meta.url), publicKey);
writeFileSync(new URL('../private.pem', import.meta.url), privateKey);

console.log('Keys generated: private.pem, public.pem');
