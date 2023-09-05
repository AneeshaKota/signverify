var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GeneralJwsVerifier } from "./jose/general/verifier.js";
import { generateCid, parseCid } from "./utils/cid.js";
//supports did:key and did:web
export function verify(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = message.content;
        // console.log('verify14,',message)
        let authorisation = message.authorisation;
        const authorisationCid = GeneralJwsVerifier.decodePlainObjectPayload(authorisation);
        const { contentCID } = authorisationCid;
        const providedDescriptorCid = parseCid(contentCID);
        const expectedDescriptorCid = yield generateCid(content);
        if (!providedDescriptorCid.equals(expectedDescriptorCid)) {
            throw new Error(`provided descriptorCid ${providedDescriptorCid} does not match expected CID ${expectedDescriptorCid}`);
        }
        //CID matches
        const verifier = new GeneralJwsVerifier(authorisation);
        return yield verifier.verify();
    });
}
export function verifyWithPublicKey(message, publicJwk) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = message.content;
        // console.log('verify14,',message)
        let authorisation = message.authorisation;
        const authorisationCid = GeneralJwsVerifier.decodePlainObjectPayload(authorisation);
        const { contentCID } = authorisationCid;
        const providedDescriptorCid = parseCid(contentCID);
        const expectedDescriptorCid = yield generateCid(content);
        if (!providedDescriptorCid.equals(expectedDescriptorCid)) {
            throw new Error(`provided descriptorCid ${providedDescriptorCid} does not match expected CID ${expectedDescriptorCid}`);
        }
        //CID matches
        const verifier = new GeneralJwsVerifier(authorisation);
        return yield verifier.verifyWithPublicKey(publicJwk);
    });
}
export function createSignatureInput(structuredDidKey) {
    const signatureInput = {
        privateJwk: structuredDidKey.keyPair.privateJwk,
        protectedHeader: {
            alg: structuredDidKey.keyPair.privateJwk.crv,
            kid: structuredDidKey.keyId
        }
    };
    return signatureInput;
}
