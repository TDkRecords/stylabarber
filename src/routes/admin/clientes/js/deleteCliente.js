import { db } from '$lib/js/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

export async function deleteCliente(id) {
    try {
        await deleteDoc(doc(db, CLIENTES_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting cliente:', error);
        throw error;
    }
}