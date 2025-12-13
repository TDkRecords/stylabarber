import { db } from '$lib/js/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const GALLERY_COLLECTION = 'gallery';

export async function getImages() {
    try {
        const q = query(collection(db, GALLERY_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting images:', error);
        throw error;
    }
}