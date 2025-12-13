import { db } from '$lib/js/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const GALLERY_COLLECTION = 'gallery';

export async function addImage(imageData) {
    try {
        const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
            ...imageData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, ...imageData };
    } catch (error) {
        console.error('Error adding image:', error);
        throw error;
    }
}

export async function updateImage({ id, ...imageData }) {
    try {
        const imageRef = doc(db, GALLERY_COLLECTION, id);
        await updateDoc(imageRef, {
            ...imageData,
            updatedAt: serverTimestamp()
        });

        return { id, ...imageData };
    } catch (error) {
        console.error('Error updating image:', error);
        throw error;
    }
}