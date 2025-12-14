import { db } from '$lib/js/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const HORARIOS_COLLECTION = 'horarios';

export async function deleteHorario(id) {
    try {
        await deleteDoc(doc(db, HORARIOS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting horario:', error);
        throw error;
    }
}