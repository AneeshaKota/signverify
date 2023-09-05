import { PrivateJwk, PublicJwk } from "../jose/types.js";
export type DidWithKeys = {
    did: string;
    keyId: string;
    keyPair: {
        publicJwk: PublicJwk;
        privateJwk: PrivateJwk;
    };
    didDocument?: DIDDocument;
};
export type DIDDocument = {
    '@context'?: 'https://www.w3.org/ns/did/v1' | string | string[];
    id: string;
    alsoKnownAs?: string[];
    controller?: string | string[];
    verificationMethod?: VerificationMethod[];
    service?: ServiceEndpoint[];
    authentication?: VerificationMethod[] | string[];
    assertionMethod?: VerificationMethod[] | string[];
    keyAgreement?: VerificationMethod[] | string[];
    capabilityInvocation?: VerificationMethod[] | string[];
    capabilityDelegation?: VerificationMethod[] | string[];
};
export type DwnServiceEndpoint = {
    nodes: string[];
};
export type ServiceEndpoint = {
    id: string;
    type: string;
    serviceEndpoint: string | DwnServiceEndpoint;
    description?: string;
};
export type VerificationMethod = {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk?: PublicJwk;
};
export type DidResolutionResult = {
    '@context'?: 'https://w3id.org/did-resolution/v1' | string | string[];
    didResolutionMetadata: DidResolutionMetadata;
    didDocument?: DIDDocument;
    didDocumentMetadata: DidDocumentMetadata;
};
export type DidResolutionMetadata = {
    contentType?: string;
    error?: 'invalidDid' | 'notFound' | 'representationNotSupported' | 'unsupportedDidMethod' | string;
};
export type DidDocumentMetadata = {
    created?: string;
    updated?: string;
    deactivated?: boolean;
    versionId?: string;
    nextUpdate?: string;
    nextVersionId?: string;
    equivalentId?: string;
    canonicalId?: string;
};
