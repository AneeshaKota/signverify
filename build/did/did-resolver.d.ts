import { DidResolutionResult } from './types.js';
export declare class DidResolver {
    resolvers: {
        [index: string]: DidMethodResolver;
    };
    /**
     * attempt to resolve the DID provided using the available DidMethodResolvers
     * @throws {Error} if DID is invalid
     * @throws {Error} if DID method is not supported
     * @throws {Error} if resolving DID fails
     * @param did - the DID to resolve
     * @returns {DidResolutionResult}
     */
    resolve(did: string): Promise<DidResolutionResult>;
}
/**
 * A generalized interface that can be implemented for individual
 * DID methods
 */
export interface DidMethodResolver {
    /**
     * @returns the DID method supported by {@link DidMethodResolver.resolve}
     */
    method(): string;
    /**
     * attempts to resolve the DID provided into its respective DID Document.
     * More info on resolving DIDs can be found
     * {@link https://www.w3.org/TR/did-core/#resolution here}
     * @param did - the DID to resolve
     * @throws {Error} if unable to resolve the DID
     */
    resolve(did: string): Promise<DidResolutionResult>;
}
