import { db } from '$lib/js/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

export async function getClientes() {
    try {
        const q = query(collection(db, CLIENTES_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting clientes:', error);
        throw error;
    }
}