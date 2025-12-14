import { db } from '$lib/js/firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

/**
 * Busca un cliente por su UID de Firebase Auth
 */
export async function getClienteByUid(uid) {
    try {
        const q = query(
            collection(db, CLIENTES_COLLECTION),
            where('uid', '==', uid)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting cliente by UID:', error);
        throw error;
    }
}

/**
 * Crea un nuevo cliente
 */
export async function addCliente(clienteData) {
    try {
        const docRef = await addDoc(collection(db, CLIENTES_COLLECTION), {
            ...clienteData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, ...clienteData };
    } catch (error) {
        console.error('Error adding cliente:', error);
        throw error;
    }
}

/**
 * Actualiza un cliente existente
 */
export async function updateCliente({ id, ...clienteData }) {
    try {
        const clienteRef = doc(db, CLIENTES_COLLECTION, id);
        await updateDoc(clienteRef, {
            ...clienteData,
            updatedAt: serverTimestamp()
        });

        return { id, ...clienteData };
    } catch (error) {
        console.error('Error updating cliente:', error);
        throw error;
    }
}