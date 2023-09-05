var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import lodash from 'lodash';
import { DidResolver } from '../../did/did-resolver.js';
import { Encoder } from '../../utils/encoder.js';
import { MemoryCache } from '../../utils/memory-cache.js';
// import { validateJsonSchema } from '../../../validator.js';
import { signers as verifiers } from '../algorithms/signers.js';
export class GeneralJwsVerifier {
    constructor(jws, cache) {
        this.jws = jws;
        this.cache = cache || new MemoryCache(600);
        this.didResolver = new DidResolver();
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            const signers = [];
            for (const signatureEntry of this.jws.signatures) {
                console.log('verifier31 ', signatureEntry);
                let isVerified;
                const cacheKey = `${signatureEntry.protected}.${this.jws.payload}.${signatureEntry.signature}`;
                const kid = GeneralJwsVerifier.getKid(signatureEntry);
                console.log('verifier34 ', kid);
                // console.log('getting public JWK')
                const publicJwk = yield this.getPublicKey(kid);
                console.log('verifier38 ', publicJwk);
                const cachedValue = yield this.cache.get(cacheKey);
                // console.log("Cached value ?", cachedValue)
                // explicit strict equality check to avoid potential buggy cache implementation causing incorrect truthy compare e.g. "false"
                if (cachedValue === undefined) {
                    isVerified = yield GeneralJwsVerifier.verifySignature(this.jws.payload, signatureEntry, publicJwk);
                    yield this.cache.set(cacheKey, isVerified);
                }
                else {
                    isVerified = cachedValue;
                }
                // console.log("Extracting DID")
                const did = GeneralJwsVerifier.extractDid(kid);
                // console.log(did)
                if (isVerified) {
                    signers.push(did);
                }
                else {
                    throw new Error(`signature verification failed for ${did}`);
                }
            }
            return { signers };
        });
    }
    verifyWithPublicKey(publicJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            const signers = [];
            for (const signatureEntry of this.jws.signatures) {
                let isVerified;
                const cacheKey = `${signatureEntry.protected}.${this.jws.payload}.${signatureEntry.signature}`;
                const kid = GeneralJwsVerifier.getKid(signatureEntry);
                // console.log(publicJwk)
                const cachedValue = yield this.cache.get(cacheKey);
                // console.log("Cached value ?", cachedValue)
                // explicit strict equality check to avoid potential buggy cache implementation causing incorrect truthy compare e.g. "false"
                if (cachedValue === undefined) {
                    isVerified = yield GeneralJwsVerifier.verifySignature(this.jws.payload, signatureEntry, publicJwk);
                    yield this.cache.set(cacheKey, isVerified);
                }
                else {
                    isVerified = cachedValue;
                }
                // console.log("Extracting DID")
                const did = GeneralJwsVerifier.extractDid(kid);
                // console.log(did)
                if (isVerified) {
                    signers.push(did);
                }
                else {
                    throw new Error(`signature verification failed for ${did}`);
                }
            }
            return { signers };
        });
    }
    /**
     * Gets the `kid` from a general JWS signature entry.
     */
    static getKid(signatureEntry) {
        // console.log('Getting KID')
        const { kid } = Encoder.base64UrlToObject(signatureEntry.protected);
        // console.log(kid)
        return kid;
    }
    /**
     * Gets the DID from a general JWS signature entry.
     */
    static getDid(signatureEntry) {
        // console.log('Getting DID')
        const kid = GeneralJwsVerifier.getKid(signatureEntry);
        const did = GeneralJwsVerifier.extractDid(kid);
        // console.log(did)
        return did;
    }
    /**
     * Gets the public key given a fully qualified key ID (`kid`).
     */
    getPublicKey(kid) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // `resolve` throws exception if DID is invalid, DID method is not supported,
            // or resolving DID fails
            const did = GeneralJwsVerifier.extractDid(kid);
            console.log('verifier133 ', did);
            const doc = yield this.didResolver.resolve(did);
            console.log('verifier135', doc);
            let verificationMethods = ((_a = doc.didDocument) === null || _a === void 0 ? void 0 : _a.verificationMethod) || [];
            console.log('verifier138', verificationMethods);
            // console.log('verification method', verificationMethods)
            let verificationMethod;
            for (const vm of verificationMethods) {
                // consider optimizing using a set for O(1) lookups if needed
                // key ID in DID Document may or may not be fully qualified. e.g.
                // `did:ion:alice#key1` or `#key1`
                // console.log('vm option ', vm)
                if (kid.endsWith(vm.id)) {
                    verificationMethod = vm;
                    break;
                }
            }
            if (!verificationMethod) {
                throw new Error('public key needed to verify signature not found in DID Document');
            }
            // if(verificationMethod.hasOwnProperty('publicKeyJwk')){
            const { publicKeyJwk: publicJwk } = verificationMethod;
            return publicJwk;
        });
    }
    static verifySignature(base64UrlPayload, signatureEntry, jwkPublic) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Verifying Signature..", jwkPublic);
            const verifier = verifiers[jwkPublic.crv];
            if (!verifier) {
                throw new Error(`unsupported crv. crv must be one of ${Object.keys(verifiers)}`);
            }
            const payload = Encoder.stringToBytes(`${signatureEntry.protected}.${base64UrlPayload}`);
            const signatureBytes = Encoder.base64UrlToBytes(signatureEntry.signature);
            return yield verifier.verify(payload, signatureBytes, jwkPublic);
        });
    }
    static decodePlainObjectPayload(jws) {
        let payloadJson;
        try {
            payloadJson = Encoder.base64UrlToObject(jws.payload);
        }
        catch (_a) {
            throw new Error('authorization payload is not a JSON object');
        }
        if (!lodash.isPlainObject(payloadJson)) {
            throw new Error('auth payload must be a valid JSON object');
        }
        return payloadJson;
    }
    /**
     * Extracts the DID from the given `kid` string.
     */
    static extractDid(kid) {
        const [did] = kid.split('#');
        return did;
    }
}