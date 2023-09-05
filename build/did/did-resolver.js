var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Did } from '../did/did.js';
import { DidKeyResolver } from './did-key-resolver.js';
import { DidWebResolver } from './did-web-resolver.js';
export class DidResolver {
    constructor() {
        this.resolvers = {
            'web': new DidWebResolver(),
            'key': new DidKeyResolver()
        };
    }
    /**
     * attempt to resolve the DID provided using the available DidMethodResolvers
     * @throws {Error} if DID is invalid
     * @throws {Error} if DID method is not supported
     * @throws {Error} if resolving DID fails
     * @param did - the DID to resolve
     * @returns {DidResolutionResult}
     */
    resolve(did) {
        return __awaiter(this, void 0, void 0, function* () {
            // naively validate requester DID
            Did.validate(did);
            const splitDID = did.split(':', 3);
            const didMethod = splitDID[1];
            const didResolver = this.resolvers[didMethod];
            if (!didResolver) {
                throw new Error(`${didMethod} DID method not supported`);
            }
            const resolutionResult = yield didResolver.resolve(did);
            const { didDocument, didResolutionMetadata } = resolutionResult;
            if (!didDocument || (didResolutionMetadata === null || didResolutionMetadata === void 0 ? void 0 : didResolutionMetadata.error)) {
                const { error } = didResolutionMetadata;
                let errMsg = `Failed to resolve DID ${did}.`;
                errMsg += error ? ` Error: ${error}` : '';
                throw new Error(errMsg);
            }
            return resolutionResult;
        });
    }
}
