/**
 * DID related operations.
 */
export class Did {
    /**
     * Gets the method specific ID segment of a DID. ie. did:<method-name>:<method-specific-id>
     */
    static getMethodSpecificId(did) {
        const secondColonIndex = did.indexOf(':', 4); // start search for : from the method portion
        const methodSpecificId = did.substring(secondColonIndex + 1);
        return methodSpecificId;
    }
    /**
     * @param did - the DID to validate
     */
    static validate(did) {
        if (typeof did !== 'string') {
            throw new Error(`DID is not string: ${did}`);
        }
        // eslint-disable-next-line
        const didRegex = /^did:([a-z0-9]+):((?:(?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))*:)*((?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))+))((;[a-zA-Z0-9_.:%-]+=[a-zA-Z0-9_.:%-]*)*)(\/[^#?]*)?([?][^#]*)?(#.*)?$/;
        if (!didRegex.test(did)) {
            throw new TypeError(`DID is not a valid DID: ${did}`);
        }
    }
    /**
     * Gets the method name from a DID. ie. did:<method-name>:<method-specific-id>
     */
    static getMethodName(did) {
        const secondColonIndex = did.indexOf(':', 4); // start search for : from the method portion
        const methodName = did.substring(4, secondColonIndex);
        return methodName;
    }
}
