import { db } from '$lib/js/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const HORARIOS_COLLECTION = 'horarios';

export async function getHorarios() {
    try {
        const q = query(collection(db, HORARIOS_COLLECTION));
        const querySnapshot = await getDocs(q);

        const horarios = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by day order
        const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return horarios.sort((a, b) => dayOrder.indexOf(a.dia) - dayOrder.indexOf(b.dia));
    } catch (error) {
        console.error('Error getting horarios:', error);
        throw error;
    }
}