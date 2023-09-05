var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as cbor from '@ipld/dag-cbor';
import { CID } from 'multiformats/cid';
import { importer } from 'ipfs-unixfs-importer';
import { sha256 } from 'multiformats/hashes/sha2';
// a map of all supported CID hashing algorithms. This map is used to select the appropriate hasher
// when generating a CID to compare against a provided CID
const hashers = {
    [sha256.code]: sha256,
};
// a map of all support codecs.This map is used to select the appropriate codec
// when generating a CID to compare against a provided CID
const codecs = {
    [cbor.code]: cbor
};
/**
 * @returns V1 CID of the DAG comprised by chunking data into unixfs dag-pb encoded blocks
 */
export function getDagPbCid(content) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const chunk = importer([{ content }], undefined, { cidVersion: 1 });
        let root;
        try {
            for (var _d = true, chunk_1 = __asyncValues(chunk), chunk_1_1; chunk_1_1 = yield chunk_1.next(), _a = chunk_1_1.done, !_a; _d = true) {
                _c = chunk_1_1.value;
                _d = false;
                root = _c;
                ;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = chunk_1.return)) yield _b.call(chunk_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return root.cid;
    });
}
/**
 * generates a V1 CID for the provided payload
 * @param payload
 * @param codecCode - the codec to use. Defaults to cbor
 * @param multihashCode - the multihasher to use. Defaults to sha256
 * @returns payload CID
 * @throws {Error} codec is not supported
 * @throws {Error} encoding fails
 * @throws {Error} if hasher is not supported
 */
export function generateCid(payload, codecCode = cbor.code, multihashCode = sha256.code) {
    return __awaiter(this, void 0, void 0, function* () {
        const codec = codecs[codecCode];
        if (!codec) {
            throw new Error(`codec [${codecCode}] not supported`);
        }
        const hasher = hashers[multihashCode];
        if (!hasher) {
            throw new Error(`multihash code [${multihashCode}] not supported`);
        }
        const payloadBytes = codec.encode(payload);
        const payloadHash = yield hasher.digest(payloadBytes);
        // console.log(codec.code)
        // console.log(payloadHash)
        return yield CID.createV1(codec.code, payloadHash);
    });
}
export function parseCid(str) {
    // console.log('cid63 - ', str)
    const cid = CID.parse(str).toV1();
    if (!codecs[cid.code]) {
        throw new Error(`codec [${cid.code}] not supported`);
    }
    if (!hashers[cid.multihash.code]) {
        throw new Error(`multihash code [${cid.multihash.code}] not supported`);
    }
    return cid;
}
