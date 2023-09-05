import { DidResolutionResult, DidWithKeys } from './types.js';
import { DidMethodResolver } from './did-resolver.js';
/**
 * did:key Resolver.
 * * **NOTE**: Key support is limited to Ed25519 and SECP256k1.
 * * **NOTE**: `verificationMethod` support is limited to `JsonWebKey2020`
 *
 * Helpful Resources:
 * * [DID-Key Draft Spec](https://w3c-ccg.github.io/did-method-key/)
 */
export declare class DidKeyResolver implements DidMethodResolver {
    method(): string;
    /**
     * Gets the number of bytes of the multicodec header in the `did:key` DID.
     * @param did - A `did:key` DID
     * @returns size of the multicodec head in number of bytes
     */
    static getMulticodecSize(did: Uint8Array): number;
    resolve(did: string): Promise<DidResolutionResult>;
    /**
     * generates a new ed25519 public/private key pair. Creates a DID using the private key
     * @returns did, public key, private key
     */
    static generate(): Promise<DidWithKeys>;
    /**
     * Gets the fully qualified key ID of a `did:key` DID. ie. '<did>#<method-specific-id>'
     */
    static getKeyId(did: string): string;
}
