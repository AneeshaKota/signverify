var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Secp256k1 from '@noble/secp256k1';
import { Encoder } from '../../utils/encoder.js';
import { sha256 } from 'multiformats/hashes/sha2';
function validateKey(jwk) {
    if (jwk.kty !== 'EC' || jwk.crv !== 'secp256k1') {
        throw new Error('invalid jwk. kty MUST be EC. crv MUST be secp256k1');
    }
}
function publicKeyToJwk(publicKeyBytes) {
    // ensure public key is in uncompressed format so we can convert it into both x and y value
    let uncompressedPublicKeyBytes;
    if (publicKeyBytes.byteLength === 33) {
        // this means given key is compressed
        const publicKeyHex = Secp256k1.utils.bytesToHex(publicKeyBytes);
        const curvePoints = Secp256k1.Point.fromHex(publicKeyHex);
        uncompressedPublicKeyBytes = curvePoints.toRawBytes(false); // isCompressed = false
    }
    else {
        uncompressedPublicKeyBytes = publicKeyBytes;
    }
    // the first byte is a header that indicates whether the key is uncompressed (0x04 if uncompressed), we can safely ignore
    // bytes 1 - 32 represent X
    // bytes 33 - 64 represent Y
    // skip the first byte because it's used as a header to indicate whether the key is uncompressed
    const x = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(1, 33));
    const y = Encoder.bytesToBase64Url(uncompressedPublicKeyBytes.subarray(33, 65));
    const publicJwk = {
        alg: 'ES256K',
        kty: 'EC',
        crv: 'secp256k1',
        x,
        y
    };
    return publicJwk;
}
export const secp256k1 = {
    sign: (content, privateJwk) => __awaiter(void 0, void 0, void 0, function* () {
        validateKey(privateJwk);
        // the underlying lib expects us to hash the content ourselves:
        // https://github.com/paulmillr/noble-secp256k1/blob/97aa518b9c12563544ea87eba471b32ecf179916/index.ts#L1160
        const hashedContent = yield sha256.encode(content);
        const privateKeyBytes = Encoder.base64UrlToBytes(privateJwk.d);
        return yield Secp256k1.sign(hashedContent, privateKeyBytes, { der: false });
    }),
    verify: (content, signature, publicJwk) => __awaiter(void 0, void 0, void 0, function* () {
        validateKey(publicJwk);
        const xBytes = Encoder.base64UrlToBytes(publicJwk.x);
        const yBytes = Encoder.base64UrlToBytes(publicJwk.y);
        const publicKeyBytes = new Uint8Array(xBytes.length + yBytes.length + 1);
        // create an uncompressed public key using the x and y values from the provided JWK.
        // a leading byte of 0x04 indicates that the public key is uncompressed
        // (e.g. x and y values are both present)
        publicKeyBytes.set([0x04], 0);
        publicKeyBytes.set(xBytes, 1);
        publicKeyBytes.set(yBytes, xBytes.length + 1);
        const hashedContent = yield sha256.encode(content);
        return Secp256k1.verify(signature, hashedContent, publicKeyBytes);
    }),
    generateKeyPair: () => __awaiter(void 0, void 0, void 0, function* () {
        const privateKeyBytes = Secp256k1.utils.randomPrivateKey();
        const publicKeyBytes = yield Secp256k1.getPublicKey(privateKeyBytes);
        const d = Encoder.bytesToBase64Url(privateKeyBytes);
        const publicJwk = publicKeyToJwk(publicKeyBytes);
        const privateJwk = Object.assign(Object.assign({}, publicJwk), { d });
        return { publicJwk, privateJwk };
    }),
    publicKeyToJwk: (publicKeyBytes) => __awaiter(void 0, void 0, void 0, function* () {
        return publicKeyToJwk(publicKeyBytes);
    })
};
