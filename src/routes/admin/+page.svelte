<script>
    import { onMount } from "svelte";
    import { db } from "$lib/js/firebase";
    import { collection, getDocs } from "firebase/firestore";

    let stats = {
        clientes: 0,
        servicios: 0,
        horarios: 0,
        citas: 0,
    };
    let loading = true;

    async function loadStats() {
        try {
            loading = true;

            const clientesSnap = await getDocs(collection(db, "clientes"));
            const serviciosSnap = await getDocs(collection(db, "servicios"));
            const horariosSnap = await getDocs(collection(db, "horarios"));
            const citasSnap = await getDocs(collection(db, "citas"));

            stats = {
                clientes: clientesSnap.size,
                servicios: serviciosSnap.size,
                horarios: horariosSnap.size,
                citas: citasSnap.size,
            };
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadStats();
    });
</script>

<div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Panel de Administración
            </h1>
            <p class="mt-2 text-sm text-gray-600">
                Bienvenido al sistema de gestión de Stayla Barbershop
            </p>
        </div>

        <!-- Stats Cards -->
        {#if loading}
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {#each [1, 2, 3, 4] as _}
                    <div class="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                {/each}
            </div>
        {:else}
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <!-- Clientes -->
                <div
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">
                                Clientes
                            </p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">
                                {stats.clientes}
                            </p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fas fa-users text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Servicios -->
                <div
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">
                                Servicios
                            </p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">
                                {stats.servicios}
                            </p>
                        </div>
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fas fa-cut text-2xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Horarios -->
                <div
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">
                                Horarios
                            </p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">
                                {stats.horarios}
                            </p>
                        </div>
                        <div class="bg-purple-100 rounded-full p-3">
                            <i class="fas fa-clock text-2xl text-purple-600"
                            ></i>
                        </div>
                    </div>
                </div>

                <!-- Citas -->
                <div
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">
                                Citas
                            </p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">
                                {stats.citas}
                            </p>
                        </div>
                        <div class="bg-orange-100 rounded-full p-3">
                            <i
                                class="fas fa-calendar-check text-2xl text-orange-600"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Quick Actions -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Acceso Rápido
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Clientes -->
                <a
                    href="/admin/clientes"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition"
                        >
                            <i class="fas fa-users text-2xl text-blue-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                Gestionar Clientes
                            </h3>
                            <p class="text-sm text-gray-600">
                                Ver y editar clientes
                            </p>
                        </div>
                    </div>
                </a>

                <!-- Servicios -->
                <a
                    href="/admin/servicios"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition"
                        >
                            <i class="fas fa-cut text-2xl text-green-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                Gestionar Servicios
                            </h3>
                            <p class="text-sm text-gray-600">
                                Administrar servicios
                            </p>
                        </div>
                    </div>
                </a>

                <!-- Horarios -->
                <a
                    href="/admin/horarios"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition"
                        >
                            <i class="fas fa-clock text-2xl text-purple-600"
                            ></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                Gestionar Horarios
                            </h3>
                            <p class="text-sm text-gray-600">
                                Configurar horarios
                            </p>
                        </div>
                    </div>
                </a>

                <!-- Citas -->
                <a
                    href="/admin/citas"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-orange-100 rounded-lg p-3 group-hover:bg-orange-200 transition"
                        >
                            <i
                                class="fas fa-calendar-check text-2xl text-orange-600"
                            ></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                Gestionar Citas
                            </h3>
                            <p class="text-sm text-gray-600">
                                Ver y administrar citas
                            </p>
                        </div>
                    </div>
                </a>

                <!-- Galería -->
                <a
                    href="/admin/galeria"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-pink-100 rounded-lg p-3 group-hover:bg-pink-200 transition"
                        >
                            <i class="fas fa-images text-2xl text-pink-600"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">
                                Gestionar Galería
                            </h3>
                            <p class="text-sm text-gray-600">
                                Administrar imágenes
                            </p>
                        </div>
                    </div>
                </a>

                <!-- Volver al sitio -->
                <a
                    href="/"
                    class="bg-gray-800 text-white rounded-lg shadow hover:shadow-lg hover:bg-gray-900 transition p-6 group"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-white/20 rounded-lg p-3 group-hover:bg-white/30 transition"
                        >
                            <i class="fas fa-home text-2xl text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Volver al Sitio</h3>
                            <p class="text-sm text-gray-300">
                                Ir a la página principal
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
