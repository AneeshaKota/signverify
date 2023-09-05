import { CID } from 'multiformats/cid';
/**
 * @returns V1 CID of the DAG comprised by chunking data into unixfs dag-pb encoded blocks
 */
export declare function getDagPbCid(content: Uint8Array): Promise<CID>;
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
export declare function generateCid(payload: any, codecCode?: 113, multihashCode?: 18): Promise<CID>;
export declare function parseCid(str: string): CID;
