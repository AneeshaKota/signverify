var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Encoder } from '../../utils/encoder.js';
import { signers } from '../algorithms/signers.js';
export class GeneralJwsSigner {
    constructor(jws) {
        this.jws = jws;
    }
    static create(payload, signatureInputs = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const jws = {
                payload: Encoder.bytesToBase64Url(payload),
                signatures: []
            };
            const signer = new GeneralJwsSigner(jws);
            for (const signatureInput of signatureInputs) {
                yield signer.addSignature(signatureInput);
            }
            return signer;
        });
    }
    addSignature(signatureInput) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("START OF DWN")
            // console.log(signatureInput)
            const { privateJwk, protectedHeader } = signatureInput;
            const signer = signers[privateJwk.crv];
            if (!signer) {
                throw new Error(`unsupported crv. crv must be one of ${Object.keys(signers)}`);
            }
            const protectedHeaderString = JSON.stringify(protectedHeader);
            const protectedHeaderBase64UrlString = Encoder.stringToBase64Url(protectedHeaderString);
            const signingInputString = `${protectedHeaderBase64UrlString}.${this.jws.payload}`;
            const signingInputBytes = Encoder.stringToBytes(signingInputString);
            const signatureBytes = yield signer.sign(signingInputBytes, privateJwk);
            const signature = Encoder.bytesToBase64Url(signatureBytes);
            this.jws.signatures.push({ protected: protectedHeaderBase64UrlString, signature });
        });
    }
    getJws() {
        return this.jws;
    }
}
