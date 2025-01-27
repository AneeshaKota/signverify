var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Ed25519 from '@noble/ed25519';
import { Encoder } from '../../utils/encoder.js';
function validateKey(jwk) {
    if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519') {
        throw new Error('invalid jwk. kty MUST be OKP. crv MUST be Ed25519');
    }
}
function publicKeyToJwk(publicKeyBytes) {
    const x = Encoder.bytesToBase64Url(publicKeyBytes);
    const publicJwk = {
        alg: 'EdDSA',
        kty: 'OKP',
        crv: 'Ed25519',
        x
    };
    return publicJwk;
}
export const ed25519 = {
    sign: (content, privateJwk) => {
        // console.log(privateJwk)
        validateKey(privateJwk);
        let privateKeyBytes = Encoder.base64UrlToBytes(privateJwk.d);
        if (privateKeyBytes.length == 64) {
            privateKeyBytes = privateKeyBytes.slice(0, 32);
        }
        return Ed25519.sign(content, privateKeyBytes);
    },
    verify: (content, signature, publicJwk) => {
        validateKey(publicJwk);
        const publicKeyBytes = Encoder.base64UrlToBytes(publicJwk.x);
        return Ed25519.verify(signature, content, publicKeyBytes);
    },
    generateKeyPair: () => __awaiter(void 0, void 0, void 0, function* () {
        const privateKeyBytes = Ed25519.utils.randomPrivateKey();
        const publicKeyBytes = yield Ed25519.getPublicKey(privateKeyBytes);
        const d = Encoder.bytesToBase64Url(privateKeyBytes);
        const publicJwk = publicKeyToJwk(publicKeyBytes);
        const privateJwk = Object.assign(Object.assign({}, publicJwk), { d });
        return { publicJwk, privateJwk };
    }),
    publicKeyToJwk: (publicKeyBytes) => __awaiter(void 0, void 0, void 0, function* () {
        return publicKeyToJwk(publicKeyBytes);
    })
};
