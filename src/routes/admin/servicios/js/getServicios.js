import { db } from '$lib/js/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const SERVICIOS_COLLECTION = 'servicios';

export async function getServicios() {
    try {
        const q = query(collection(db, SERVICIOS_COLLECTION), orderBy('nombre', 'asc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting servicios:', error);
        throw error;
    }
}