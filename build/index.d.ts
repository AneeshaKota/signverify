export type { APIBody } from './verify.js';
export type { PublicJwk, PrivateJwk } from './jose/types.js';
export type { DwnServiceEndpoint, ServiceEndpoint, VerificationMethod, DIDDocument } from "./did/types.js";
export { verifyWithPublicKey, createSignatureInput } from './verify.js';
export { DidWebResolver } from './did/did-web-resolver.js';
export { sign } from './sign.js';
