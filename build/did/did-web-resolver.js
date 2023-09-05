var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Did } from './did.js';
import { ed25519 } from '../jose/algorithms/ed25519.js';
import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import { secp256k1 } from '../jose/algorithms/secp256k1.js';
export class DidWebResolver {
    constructor() {
        this.webResolver = getResolver();
        this.didWebResolver = new Resolver(Object.assign({}, this.webResolver));
    }
    method() {
        return 'web';
    }
    resolve(did) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.didWebResolver.resolve(did);
        });
    }
    /**
     * generates a new ed25519/secp256k1 public/private key pair. Creates a DID using the private key
     * @returns did, public key, private key
     */
    static generate(did, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyId = did + "#key-1";
            let keyPair;
            if (type === 'secp256k1') {
                keyPair = yield secp256k1.generateKeyPair();
            }
            else {
                keyPair = yield ed25519.generateKeyPair();
            }
            const didDocument = {
                '@context': [
                    'https://www.w3.org/ns/did/v1',
                    'https://w3id.org/security/suites/jws-2020/v1',
                    'https://w3id.org/security/suites/ed25519-2020/v1'
                ],
                'id': did,
                'verificationMethod': [{
                        id: keyId,
                        type: 'JsonWebKey2020',
                        controller: did,
                        publicKeyJwk: keyPair.publicJwk
                    }],
                'authentication': [keyId],
                'assertionMethod': [keyId],
                'capabilityDelegation': [keyId],
                'capabilityInvocation': [keyId]
            };
            return { did, keyId, keyPair, didDocument };
        });
    }
    /**
     * Gets the fully qualified key ID of a `did:key` DID. ie. '<did>#<method-specific-id>'
     */
    static getKeyId(did) {
        const methodSpecificId = Did.getMethodSpecificId(did);
        const keyId = `${did}#${methodSpecificId}`;
        return keyId;
    }
    ;
}
