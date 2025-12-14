import { db } from '$lib/js/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CITAS_COLLECTION = 'citas';

/**
 * Crea una nueva cita
 * @param {Object} citaData - Datos de la cita
 * @param {string} citaData.clienteId - ID del cliente (Firebase UID)
 * @param {string} citaData.clienteNombre - Nombre del cliente
 * @param {string} citaData.clienteEmail - Email del cliente
 * @param {string} citaData.clienteFoto - URL de foto del cliente
 * @param {string} citaData.servicioId - ID del servicio
 * @param {string} citaData.servicioNombre - Nombre del servicio
 * @param {number} citaData.precio - Precio del servicio
 * @param {number} citaData.duracion - Duración en minutos
 * @param {string} citaData.fecha - Fecha en formato YYYY-MM-DD
 * @param {string} citaData.hora - Hora en formato HH:MM
 * @param {string} citaData.estado - Estado de la cita (pendiente, confirmada, completada, cancelada)
 */
export async function addCita(citaData) {
    try {
        const docRef = await addDoc(collection(db, CITAS_COLLECTION), {
            ...citaData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { id: docRef.id, ...citaData };
    } catch (error) {
        console.error('Error adding cita:', error);
        throw error;
    }
}