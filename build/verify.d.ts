import { DIDDocument, DidWithKeys } from "./did/types.js";
import { GeneralJws, SignatureInput } from "./jose/general/types.js";
import { PublicJwk } from "./jose/types.js";
export type APIBody = {
    content: DIDDocument;
    authorisation: GeneralJws;
};
export declare function verify(message: APIBody): Promise<{
    signers: string[];
}>;
export declare function verifyWithPublicKey(message: APIBody, publicJwk: PublicJwk): Promise<{
    signers: string[];
}>;
export declare function createSignatureInput(structuredDidKey: DidWithKeys): SignatureInput;
