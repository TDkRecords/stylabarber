<script>
    import { onMount } from "svelte";
    import { db } from "$lib/js/firebase";
    import {
        collection,
        getDocs,
        doc,
        updateDoc,
        query,
        orderBy,
    } from "firebase/firestore";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import CitaCard from "./components/CitaCard.svelte";
    import FiltrosCitas from "./components/FiltrosCitas.svelte";
    import EstadisticasCitas from "./components/EstadisticasCitas.svelte";

    let citas = [];
    let citasFiltradas = [];
    let loading = true;
    let error = null;
    let processingId = null;

    // Filtros
    let filtroEstado = "todas";
    let filtroFecha = "todas";
    let filtroAsistencia = "todas";
    let busqueda = "";

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

    onMount(async () => {
        await loadCitas();
    });

    async function loadCitas() {
        try {
            loading = true;
            error = null;

            const q = query(collection(db, "citas"), orderBy("fecha", "desc"));
            const snapshot = await getDocs(q);

            citas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            aplicarFiltros();
        } catch (err) {
            console.error("Error cargando citas:", err);
            error = "Error al cargar las citas. Por favor recarga la página.";
        } finally {
            loading = false;
        }
    }

    async function cambiarEstado(citaId, nuevoEstado) {
        try {
            processingId = citaId;
            const citaRef = doc(db, "citas", citaId);

            await updateDoc(citaRef, {
                estado: nuevoEstado,
                updatedAt: new Date().toISOString(),
            });

            // Actualizar localmente
            citas = citas.map((c) =>
                c.id === citaId ? { ...c, estado: nuevoEstado } : c,
            );

            aplicarFiltros();
        } catch (err) {
            console.error("Error cambiando estado:", err);
            alert("Error al cambiar el estado de la cita");
        } finally {
            processingId = null;
        }
    }

    async function marcarAsistencia(citaId, asistio) {
        try {
            processingId = citaId;
            const citaRef = doc(db, "citas", citaId);

            await updateDoc(citaRef, {
                asistio: asistio,
                fechaAsistencia: asistio ? new Date().toISOString() : null,
                estado: asistio ? "completada" : "cancelada",
                updatedAt: new Date().toISOString(),
            });

            // Actualizar localmente
            citas = citas.map((c) =>
                c.id === citaId
                    ? {
                          ...c,
                          asistio: asistio,
                          fechaAsistencia: asistio
                              ? new Date().toISOString()
                              : null,
                          estado: asistio ? "completada" : "cancelada",
                      }
                    : c,
            );

            aplicarFiltros();
        } catch (err) {
            console.error("Error marcando asistencia:", err);
            alert("Error al marcar la asistencia");
        } finally {
            processingId = null;
        }
    }

    function aplicarFiltros() {
        citasFiltradas = citas.filter((cita) => {
            // Filtro por estado
            if (filtroEstado !== "todas" && cita.estado !== filtroEstado) {
                return false;
            }

            // Filtro por asistencia
            if (filtroAsistencia === "asistio" && cita.asistio !== true) {
                return false;
            }
            if (filtroAsistencia === "no_asistio" && cita.asistio !== false) {
                return false;
            }
            if (
                filtroAsistencia === "pendiente" &&
                cita.asistio !== undefined &&
                cita.asistio !== null
            ) {
                return false;
            }

            // Filtro por fecha
            const citaDate = new Date(cita.fecha + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (filtroFecha === "hoy") {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (citaDate < today || citaDate >= tomorrow) return false;
            } else if (filtroFecha === "proximas") {
                if (citaDate < today) return false;
            } else if (filtroFecha === "pasadas") {
                if (citaDate >= today) return false;
            }

            // Búsqueda por nombre, teléfono o servicio
            if (busqueda) {
                const searchLower = busqueda.toLowerCase();
                const matches =
                    cita.clienteNombre?.toLowerCase().includes(searchLower) ||
                    cita.clienteTelefono?.includes(busqueda) ||
                    cita.servicioNombre?.toLowerCase().includes(searchLower);
                if (!matches) return false;
            }

            return true;
        });
    }

    // Estadísticas
    $: estadisticas = {
        total: citas.length,
        pendientes: citas.filter((c) => c.estado === "pendiente").length,
        confirmadas: citas.filter((c) => c.estado === "confirmada").length,
        completadas: citas.filter((c) => c.estado === "completada").length,
        canceladas: citas.filter((c) => c.estado === "cancelada").length,
        asistieron: citas.filter((c) => c.asistio === true).length,
        noAsistieron: citas.filter((c) => c.asistio === false).length,
    };

    // Re-aplicar filtros cuando cambien
    $: if (filtroEstado || filtroFecha || filtroAsistencia || busqueda) {
        aplicarFiltros();
    }
</script>

<section class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="mb-4 flex items-center text-sm text-gray-600">
            <a href="/admin" class="hover:text-gray-900">Admin</a>
            <i class="fas fa-chevron-right mx-2 text-xs"></i>
            <span class="text-gray-900 font-medium">Citas</span>
        </nav>

        <!-- Header -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1
                        class="text-3xl font-bold text-gray-900 flex items-center gap-3"
                    >
                        <i class="fas fa-calendar-check text-black"></i>
                        Gestión de Citas
                    </h1>
                    <p class="text-gray-600 mt-1">
                        Administra las reservas de tus clientes
                    </p>
                </div>

                <button
                    on:click={loadCitas}
                    disabled={loading}
                    class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800
                           transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <i class="fas fa-sync-alt {loading ? 'fa-spin' : ''}"></i>
                    Recargar
                </button>
            </div>
        </div>

        {#if loading}
            <LoadingSpinner />
        {:else if error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p class="text-red-700">{error}</p>
            </div>
        {:else}
            <!-- Estadísticas -->
            <EstadisticasCitas {estadisticas} />

            <!-- Filtros -->
            <FiltrosCitas
                bind:filtroEstado
                bind:filtroFecha
                bind:filtroAsistencia
                bind:busqueda
            />

            <!-- Lista de Citas -->
            <div class="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div
                    class="bg-gradient-to-r from-black to-gray-800 text-white p-6"
                >
                    <h2
                        class="text-xl font-bold flex items-center justify-between"
                    >
                        <span>
                            <i class="fas fa-list mr-2"></i>
                            Citas ({citasFiltradas.length})
                        </span>
                        {#if busqueda}
                            <button
                                on:click={() => (busqueda = "")}
                                class="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
                            >
                                <i class="fas fa-times mr-1"></i>
                                Limpiar búsqueda
                            </button>
                        {/if}
                    </h2>
                </div>

                <div class="p-6">
                    {#if citasFiltradas.length === 0}
                        <div class="text-center py-12">
                            <div
                                class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <i
                                    class="fas fa-calendar-times text-4xl text-gray-400"
                                ></i>
                            </div>
                            <h3
                                class="text-lg font-semibold text-gray-900 mb-2"
                            >
                                No hay citas
                            </h3>
                            <p class="text-gray-600">
                                {#if busqueda || filtroEstado !== "todas" || filtroFecha !== "todas" || filtroAsistencia !== "todas"}
                                    No se encontraron citas con los filtros
                                    seleccionados
                                {:else}
                                    Aún no hay citas registradas en el sistema
                                {/if}
                            </p>
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each citasFiltradas as cita (cita.id)}
                                <CitaCard
                                    {cita}
                                    {estadoConfig}
                                    {processingId}
                                    onCambiarEstado={cambiarEstado}
                                    onMarcarAsistencia={marcarAsistencia}
                                />
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</section>
