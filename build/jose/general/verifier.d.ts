import type { Cache } from '../../utils/types.js';
import type { PublicJwk } from '../types.js';
import type { GeneralJws, SignatureEntry } from './types.js';
import { DidResolver } from '../../did/did-resolver.js';
type VerificationResult = {
    /** DIDs of all signers */
    signers: string[];
};
export declare class GeneralJwsVerifier {
    jws: GeneralJws;
    cache: Cache;
    didResolver: DidResolver;
    constructor(jws: GeneralJws, cache?: Cache);
    verify(): Promise<VerificationResult>;
    verifyWithPublicKey(publicJwk: PublicJwk): Promise<{
        signers: string[];
    }>;
    /**
     * Gets the `kid` from a general JWS signature entry.
     */
    private static getKid;
    /**
     * Gets the DID from a general JWS signature entry.
     */
    static getDid(signatureEntry: SignatureEntry): string;
    /**
     * Gets the public key given a fully qualified key ID (`kid`).
     */
    getPublicKey(kid: string): Promise<PublicJwk>;
    static verifySignature(base64UrlPayload: string, signatureEntry: SignatureEntry, jwkPublic: PublicJwk): Promise<boolean>;
    static decodePlainObjectPayload(jws: GeneralJws): any;
    /**
     * Extracts the DID from the given `kid` string.
     */
    static extractDid(kid: string): string;
}
export {};
