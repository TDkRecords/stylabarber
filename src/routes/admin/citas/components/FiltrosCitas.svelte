<script>
    export let filtroEstado;
    export let filtroFecha;
    export let filtroAsistencia;
    export let busqueda;

    function limpiarFiltros() {
        filtroEstado = "todas";
        filtroFecha = "todas";
        filtroAsistencia = "todas";
        busqueda = "";
    }

    $: hayFiltrosActivos =
        filtroEstado !== "todas" ||
        filtroFecha !== "todas" ||
        filtroAsistencia !== "todas" ||
        busqueda !== "";
</script>

<div class="bg-white shadow-lg rounded-xl p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold flex items-center gap-2">
            <i class="fas fa-filter"></i>
            Filtros
        </h3>

        {#if hayFiltrosActivos}
            <button
                on:click={limpiarFiltros}
                class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
                <i class="fas fa-times-circle"></i>
                Limpiar filtros
            </button>
        {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-search mr-1"></i>
                Buscar
            </label>
            <input
                type="text"
                bind:value={busqueda}
                placeholder="Nombre, teléfono o servicio..."
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
        </div>

        <!-- Estado -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-tag mr-1"></i>
                Estado
            </label>
            <select
                bind:value={filtroEstado}
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
                <option value="todas">Todas</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmada">Confirmadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
            </select>
        </div>

        <!-- Fecha -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-calendar mr-1"></i>
                Fecha
            </label>
            <select
                bind:value={filtroFecha}
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
                <option value="todas">Todas</option>
                <option value="hoy">Hoy</option>
                <option value="proximas">Próximas</option>
                <option value="pasadas">Pasadas</option>
            </select>
        </div>

        <!-- Asistencia -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-user-check mr-1"></i>
                Asistencia
            </label>
            <select
                bind:value={filtroAsistencia}
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
                <option value="todas">Todas</option>
                <option value="asistio">Asistieron</option>
                <option value="no_asistio">No asistieron</option>
                <option value="pendiente">Sin registrar</option>
            </select>
        </div>
    </div>
</div>
