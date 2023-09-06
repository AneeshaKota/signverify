import { sign } from "./src/sign.js";
import { APIBody, createSignatureInput, verify, verifyWithPublicKey } from "./src/verify.js";
import { DidResolver } from "./src/did/did-resolver.js";
import { DidKeyResolver } from "./src/did/did-key-resolver.js";
import { DidWebResolver } from "./src/did/did-web-resolver.js";
import { DIDDocument } from "did-resolver";
import { PublicJwk } from "./src/jose/types.js";

let didResolver = new DidResolver()

// const initDIDkey = async () => {
//     let did = await DidKeyResolver.generate()
//     console.log("This is did1 ", did)
    
//     let content = "My Name is Jake"
    
//     // as the message sender, I have access to my private key so can create the authorisation object
//     let authorisation = await sign(content, createSignatureInput(did))

//     let signed_message: APIBody = {
//         content: content,
//         authorisation: authorisation
//     }
    
//     console.log("the signed message by me ", signed_message)
    
//     // as the message verifier, I do not have access to the public key directly, so I have to resolve the on the did
//     let didDoc = await didResolver.resolve(did.did)
//     console.log("did1's didDoc ", didDoc)
//     let did1public = didDoc.didDocument?.verificationMethod![0].publicKeyJwk
//     console.log("did1 publickeyHex ", did1public)

//     // DIDDoc resolving is handled directly by the verify method
//     let verified_message_did = await verify(signed_message)
//     console.log("verification result", verified_message_did)

// }

const initDIDweb = async () => {
    let did = await DidWebResolver.generate("did:web:tel-did-web-storage.dxt.online:didDocs:Jane-DOE", "secp256k1")
    console.log("This is my did", did)
    const { didDocument: _, ...didNew} = did;
    let did2 = await DidWebResolver.generate("did:web:tel-did-web-storage.dxt.online:didDocs:Jane-DOE", "secp256k1")

    let content = did.didDocument
    // const { id: _, ...fakeDid} = content;
    // let content = { ...did.didDocument, name: "aneesha" }
    console.log("verification method - ", content?.verificationMethod);
    
    // as the message sender, I have access to my private key so can create the authorisation object
    let authorisation = await sign(content, createSignatureInput(didNew))

    let signed_message: any = {
        content: content,
        authorisation: authorisation
    }
    
    console.log("the signed message by me ", signed_message)
    console.log("signatures - ", signed_message.authorisation.signatures);
    
    // When I am uploading the diddocument for the first time, I cannot resolve the did so I check against the content
    let didDoc: DIDDocument = signed_message.content as DIDDocument
    let publicKey: PublicJwk = didDoc.verificationMethod![0].publicKeyJwk as PublicJwk

    let verified_message_did = await verifyWithPublicKey(signed_message, publicKey!)
    console.log("verification result", verified_message_did)
}

console.log("hello")
// initDIDkey()
initDIDweb()