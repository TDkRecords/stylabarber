import { db } from '$lib/js/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

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