<script>
    import { deleteDoc, doc } from "firebase/firestore";
    import { db } from "$lib/js/firebase";

    export let reservas = [];
    export let onReload;

    let cancelingId = null;

    const estadoConfig = {
        pendiente: {
            color: "bg-yellow-100 text-yellow-800 border-yellow-300",
            icon: "fa-clock",
            label: "Pendiente",
        },
        confirmada: {
            color: "bg-blue-100 text-blue-800 border-blue-300",
            icon: "fa-check-circle",
            label: "Confirmada",
        },
        completada: {
            color: "bg-green-100 text-green-800 border-green-300",
            icon: "fa-check-double",
            label: "Completada",
        },
        cancelada: {
            color: "bg-red-100 text-red-800 border-red-300",
            icon: "fa-times-circle",
            label: "Cancelada",
        },
    };

    function formatDate(dateStr) {
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function isPastReservation(fecha, hora) {
        const [year, month, day] = fecha.split("-").map(Number);
        const [hh, mm] = hora.split(":").map(Number);
        const reservaDate = new Date(year, month - 1, day, hh, mm);
        return reservaDate < new Date();
    }

    function canCancel(reserva) {
        // Solo se puede cancelar si está pendiente o confirmada y no ha pasado
        return (
            (reserva.estado === "pendiente" ||
                reserva.estado === "confirmada") &&
            !isPastReservation(reserva.fecha, reserva.hora)
        );
    }

    async function handleCancel(id) {
        if (
            !confirm(
                "¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.",
            )
        )
            return;

        try {
            cancelingId = id;
            await deleteDoc(doc(db, "citas", id));
            await onReload();
        } catch (error) {
            console.error("Error al cancelar reserva:", error);
            alert(
                "Error al cancelar la reserva. Por favor intenta nuevamente.",
            );
        } finally {
            cancelingId = null;
        }
    }

    // Ordenar reservas: próximas primero, luego pasadas
    $: sortedReservas = [...reservas].sort((a, b) => {
        const dateA = new Date(a.fecha + "T" + a.hora);
        const dateB = new Date(b.fecha + "T" + b.hora);
        return dateB - dateA; // Más recientes primero
    });
</script>

<div class="bg-white shadow-xl rounded-2xl overflow-hidden">
    <div class="bg-linear-to-r from-black to-gray-800 text-white p-6">
        <h2 class="text-2xl font-bold flex items-center gap-3">
            <i class="fas fa-history"></i>
            Historial de Reservas
        </h2>
        <p class="text-white/80 text-sm mt-1">
            {reservas.length} reserva{reservas.length !== 1 ? "s" : ""} en total
        </p>
    </div>

    <div class="p-6">
        {#if reservas.length === 0}
            <div class="text-center py-12">
                <div
                    class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                    <i class="fas fa-calendar-times text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    No tienes reservas
                </h3>
                <p class="text-gray-600">
                    Crea tu primera reserva usando el formulario de arriba
                </p>
            </div>
        {:else}
            <div class="space-y-4">
                {#each sortedReservas as reserva (reserva.id)}
                    {@const config =
                        estadoConfig[reserva.estado] || estadoConfig.pendiente}
                    {@const isPast = isPastReservation(
                        reserva.fecha,
                        reserva.hora,
                    )}

                    <div
                        class="border-2 {isPast
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-black/10 bg-white'} 
                               rounded-xl p-5 hover:shadow-lg transition-all"
                    >
                        <div
                            class="flex flex-col md:flex-row justify-between gap-4"
                        >
                            <!-- Información principal -->
                            <div class="flex-1">
                                <div class="flex items-start gap-3 mb-3">
                                    <div
                                        class="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center shrink-0"
                                    >
                                        <i class="fas fa-cut text-xl"></i>
                                    </div>
                                    <div class="flex-1">
                                        <h3
                                            class="font-bold text-lg {isPast
                                                ? 'text-gray-600'
                                                : 'text-gray-900'}"
                                        >
                                            {reserva.servicioNombre}
                                        </h3>
                                        <div
                                            class="flex flex-wrap gap-4 mt-2 text-sm {isPast
                                                ? 'text-gray-500'
                                                : 'text-gray-600'}"
                                        >
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <i class="fas fa-calendar-day"
                                                ></i>
                                                {formatDate(reserva.fecha)}
                                            </span>
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <i class="fas fa-clock"></i>
                                                {reserva.hora}
                                            </span>
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <i class="fas fa-hourglass-half"
                                                ></i>
                                                {reserva.duracion} min
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Estado y precio -->
                                <div
                                    class="flex flex-wrap items-center gap-3 mt-3"
                                >
                                    <span
                                        class="px-3 py-1 text-xs font-semibold rounded-full border {config.color} 
                                               inline-flex items-center gap-1"
                                    >
                                        <i class="fas {config.icon}"></i>
                                        {config.label}
                                    </span>

                                    <span
                                        class="text-lg font-bold {isPast
                                            ? 'text-gray-500'
                                            : 'text-green-600'}"
                                    >
                                        ${reserva.precio.toLocaleString(
                                            "es-CO",
                                        )}
                                    </span>

                                    {#if isPast && reserva.estado !== "cancelada" && reserva.estado !== "completada"}
                                        <span
                                            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                                        >
                                            <i class="fas fa-history mr-1"></i>
                                            Pasada
                                        </span>
                                    {/if}
                                </div>
                            </div>

                            <!-- Acciones -->
                            {#if canCancel(reserva)}
                                <div class="flex items-start">
                                    <button
                                        on:click={() =>
                                            handleCancel(reserva.id)}
                                        disabled={cancelingId === reserva.id}
                                        class="px-4 py-2 bg-red-50 text-red-600 rounded-lg
                                               hover:bg-red-100 transition-all text-sm font-medium
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               flex items-center gap-2"
                                    >
                                        {#if cancelingId === reserva.id}
                                            <i class="fas fa-spinner fa-spin"
                                            ></i>
                                            Cancelando...
                                        {:else}
                                            <i class="fas fa-times-circle"></i>
                                            Cancelar Reserva
                                        {/if}
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
