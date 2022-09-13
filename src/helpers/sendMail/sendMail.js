import { MAILS_COLLECTION } from "../../__constants__/collections"

const sendMail = async (firestore, email, text) => {
    if(!email || !text) throw new Error(`${!email ? 'email' : 'text'} is required to send email`)

    const docId = firestore.collection(MAILS_COLLECTION).doc().id
    await firestore.collection(MAILS_COLLECTION).doc(docId).create({_id: docId, email, text})
}

export default sendMail