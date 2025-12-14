import { db } from '$lib/js/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const HORARIOS_COLLECTION = 'horarios';

export async function addHorario(horarioData) {
    try {
        const docRef = await addDoc(collection(db, HORARIOS_COLLECTION), {
            ...horarioData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, ...horarioData };
    } catch (error) {
        console.error('Error adding horario:', error);
        throw error;
    }
}

export async function updateHorario({ id, ...horarioData }) {
    try {
        const horarioRef = doc(db, HORARIOS_COLLECTION, id);
        await updateDoc(horarioRef, {
            ...horarioData,
            updatedAt: serverTimestamp()
        });

        return { id, ...horarioData };
    } catch (error) {
        console.error('Error updating horario:', error);
        throw error;
    }
}