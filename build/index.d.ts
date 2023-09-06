export type { APIBody } from './verify.js';
export type { PublicJwk, PrivateJwk } from './jose/types.js';
export type { DwnServiceEndpoint, ServiceEndpoint, VerificationMethod, DIDDocument } from "./did/types.js";
export { verifyWithPublicKey, createSignatureInput } from './verify.js';
export { DidResolver } from './did/did-resolver.js';
export { DidWebResolver } from './did/did-web-resolver.js';
export { DidKeyResolver } from './did/did-key-resolver.js';
export { sign } from './sign.js';
