/**
 * DID related operations.
 */
export declare class Did {
    /**
     * Gets the method specific ID segment of a DID. ie. did:<method-name>:<method-specific-id>
     */
    static getMethodSpecificId(did: string): string;
    /**
     * @param did - the DID to validate
     */
    static validate(did: unknown): void;
    /**
     * Gets the method name from a DID. ie. did:<method-name>:<method-specific-id>
     */
    static getMethodName(did: string): string;
}
