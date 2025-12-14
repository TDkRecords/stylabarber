import { db } from '$lib/js/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const CITAS_COLLECTION = 'citas';

/**
 * Obtiene todas las citas
 */
export async function getCitas() {
    try {
        const q = query(
            collection(db, CITAS_COLLECTION),
            orderBy('fecha', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting citas:', error);
        throw error;
    }
}

/**
 * Obtiene las citas de un cliente específico
 */
export async function getCitasCliente(clienteId) {
    try {
        const q = query(
            collection(db, CITAS_COLLECTION),
            where('clienteId', '==', clienteId),
            orderBy('fecha', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting citas for client:', error);
        throw error;
    }
}

/**
 * Obtiene las citas de una fecha específica
 */
export async function getCitasPorFecha(fecha) {
    try {
        const q = query(
            collection(db, CITAS_COLLECTION),
            where('fecha', '==', fecha),
            orderBy('hora', 'asc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting citas by date:', error);
        throw error;
    }
}