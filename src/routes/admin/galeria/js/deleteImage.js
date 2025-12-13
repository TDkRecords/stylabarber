import { db } from '$lib/js/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const GALLERY_COLLECTION = 'gallery';

export async function deleteImage(id) {
    try {
        await deleteDoc(doc(db, GALLERY_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}