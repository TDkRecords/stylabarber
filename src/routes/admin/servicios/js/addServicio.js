import { db } from '$lib/js/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const SERVICIOS_COLLECTION = 'servicios';

export async function addServicio(servicioData) {
    try {
        const docRef = await addDoc(collection(db, SERVICIOS_COLLECTION), {
            ...servicioData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, ...servicioData };
    } catch (error) {
        console.error('Error adding servicio:', error);
        throw error;
    }
}

export async function updateServicio({ id, ...servicioData }) {
    try {
        const servicioRef = doc(db, SERVICIOS_COLLECTION, id);
        await updateDoc(servicioRef, {
            ...servicioData,
            updatedAt: serverTimestamp()
        });

        return { id, ...servicioData };
    } catch (error) {
        console.error('Error updating servicio:', error);
        throw error;
    }
}