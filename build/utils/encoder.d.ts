/**
 * Utility class for encoding/converting data into various formats.
 */
export declare class Encoder {
    static base64UrlToBytes(base64urlString: string): Uint8Array;
    static base64UrlToObject(base64urlString: string): any;
    static bytesToBase64Url(bytes: Uint8Array): string;
    static bytesToString(content: Uint8Array): string;
    static objectToBytes(obj: any): Uint8Array;
    static stringToBase64Url(content: string): string;
    static stringToBytes(content: string): Uint8Array;
}
