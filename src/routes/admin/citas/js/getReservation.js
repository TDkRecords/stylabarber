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
        if (!clienteId) {
            console.error('ID de cliente no proporcionado');
            return [];
        }

        console.log('Buscando citas para el cliente:', clienteId);

        const q = query(
            collection(db, CITAS_COLLECTION),
            where('clienteId', '==', clienteId)
        );

        const querySnapshot = await getDocs(q);
        console.log(`Se encontraron ${querySnapshot.size} citas para el cliente`);

        // Mapeamos los documentos a objetos
        const citas = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Aseguramos que la fecha esté en el formato correcto
            const fecha = data.fecha?.split('T')[0] || data.fecha;

            return {
                id: doc.id,
                ...data,
                fecha: fecha
            };
        });

        // Ordenamos manualmente por fecha (más reciente primero)
        citas.sort((a, b) => {
            try {
                const dateA = new Date(a.fecha);
                const dateB = new Date(b.fecha);
                return dateB - dateA;
            } catch (e) {
                console.error('Error ordenando fechas:', e);
                return 0;
            }
        });

        console.log('Citas ordenadas:', citas);
        return citas;
    } catch (error) {
        console.error('Error al obtener citas del cliente:', error);
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
        console.error('Error obteniendo citas por fecha:', error);
        throw error;
    }
}