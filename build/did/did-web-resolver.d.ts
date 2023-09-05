import { DidResolutionResult, DIDDocument } from './types.js';
import { Resolver } from 'did-resolver';
import { DidMethodResolver } from './did-resolver.js';
import { PrivateJwk, PublicJwk } from '../index.js';
export declare class DidWebResolver implements DidMethodResolver {
    method(): string;
    webResolver: Record<string, import("did-resolver").DIDResolver>;
    didWebResolver: Resolver;
    resolve(did: string): Promise<DidResolutionResult>;
    /**
     * generates a new ed25519/secp256k1 public/private key pair. Creates a DID using the private key
     * @returns did, public key, private key
     */
    static generate(did: string, type?: string): Promise<{
        did: string;
        keyId: string;
        keyPair: {
            publicJwk: PublicJwk;
            privateJwk: PrivateJwk;
        };
        didDocument: DIDDocument;
    }>;
    /**
     * Gets the fully qualified key ID of a `did:key` DID. ie. '<did>#<method-specific-id>'
     */
    static getKeyId(did: string): string;
}
