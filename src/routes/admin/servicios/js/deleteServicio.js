import { db } from '$lib/js/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const SERVICIOS_COLLECTION = 'servicios';

export async function deleteServicio(id) {
    try {
        await deleteDoc(doc(db, SERVICIOS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting servicio:', error);
        throw error;
    }
}