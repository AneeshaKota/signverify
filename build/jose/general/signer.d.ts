import type { GeneralJws, SignatureInput } from './types.js';
export declare class GeneralJwsSigner {
    private jws;
    constructor(jws: GeneralJws);
    static create(payload: Uint8Array, signatureInputs?: SignatureInput[]): Promise<GeneralJwsSigner>;
    addSignature(signatureInput: SignatureInput): Promise<void>;
    getJws(): GeneralJws;
}
