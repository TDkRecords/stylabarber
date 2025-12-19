<script>
    export let cita;
    export let estadoConfig;
    export let processingId;
    export let onCambiarEstado;
    export let onMarcarAsistencia;

    $: config = estadoConfig[cita.estado] || estadoConfig.pendiente;
    $: isPast = isPastReservation(cita.fecha, cita.hora);
    $: canMarkAttendance =
        (isPast && cita.asistio === undefined) || cita.asistio === null;

    function isPastReservation(fecha, hora) {
        const [year, month, day] = fecha.split("-").map(Number);
        const [hh, mm] = hora.split(":").map(Number);
        const reservaDate = new Date(year, month - 1, day, hh, mm);
        return reservaDate < new Date();
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatDateTime(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div
    class="border-2 {isPast && cita.estado !== 'completada'
        ? 'border-gray-200 bg-gray-50'
        : 'border-black/10 bg-white'} 
           rounded-xl p-5 hover:shadow-lg transition-all"
>
    <div class="flex flex-col lg:flex-row gap-6">
        <!-- Información del Cliente -->
        <div class="flex-1">
            <div class="flex items-start gap-4 mb-4">
                {#if cita.clienteFoto}
                    <img
                        src={cita.clienteFoto}
                        alt={cita.clienteNombre}
                        class="w-14 h-14 rounded-full border-2 border-gray-200"
                    />
                {:else}
                    <div
                        class="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                        <i class="fas fa-user text-gray-500 text-xl"></i>
                    </div>
                {/if}

                <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-900">
                        {cita.clienteNombre}
                    </h3>
                    <div
                        class="flex flex-wrap gap-3 mt-1 text-sm text-gray-600"
                    >
                        <span class="flex items-center gap-1">
                            <i class="fas fa-phone"></i>
                            {cita.clienteTelefono}
                        </span>
                        <span class="flex items-center gap-1">
                            <i class="fas fa-envelope"></i>
                            {cita.clienteEmail}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Información del Servicio -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center gap-2 mb-2">
                    <i class="fas fa-cut text-black"></i>
                    <span class="font-semibold">{cita.servicioNombre}</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                        <span class="text-gray-600">Fecha:</span>
                        <p class="font-medium">{formatDate(cita.fecha)}</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Hora:</span>
                        <p class="font-medium">{cita.hora}</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Duración:</span>
                        <p class="font-medium">{cita.duracion} min</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Precio:</span>
                        <p class="font-medium text-green-600">
                            ${cita.precio.toLocaleString("es-CO")}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Estados y Badges -->
            <div class="flex flex-wrap gap-2">
                <span
                    class="px-3 py-1 text-xs font-semibold rounded-full border {config.color} 
                           inline-flex items-center gap-1"
                >
                    <i class="fas {config.icon}"></i>
                    {config.label}
                </span>

                {#if cita.asistio === true}
                    <span
                        class="px-3 py-1 text-xs font-semibold rounded-full border
                               bg-green-100 text-green-800 border-green-300 inline-flex items-center gap-1"
                    >
                        <i class="fas fa-user-check"></i>
                        Cliente Asistió
                    </span>
                {:else if cita.asistio === false}
                    <span
                        class="px-3 py-1 text-xs font-semibold rounded-full border
                               bg-red-100 text-red-800 border-red-300 inline-flex items-center gap-1"
                    >
                        <i class="fas fa-user-times"></i>
                        No Asistió
                    </span>
                {/if}

                {#if isPast && !cita.asistio && cita.asistio !== false}
                    <span
                        class="px-3 py-1 text-xs font-semibold rounded-full border
                               bg-gray-100 text-gray-800 border-gray-300 inline-flex items-center gap-1"
                    >
                        <i class="fas fa-history"></i>
                        Cita Pasada
                    </span>
                {/if}
            </div>

            {#if cita.fechaAsistencia}
                <p class="text-xs text-gray-500 mt-2">
                    <i class="fas fa-clock mr-1"></i>
                    Registrado: {formatDateTime(cita.fechaAsistencia)}
                </p>
            {/if}
        </div>

        <!-- Acciones -->
        <div class="flex flex-col gap-3 lg:w-64">
            <div class="text-sm font-semibold text-gray-700 mb-1">
                <i class="fas fa-cog mr-1"></i>
                Acciones
            </div>

            <!-- Cambiar Estado -->
            {#if cita.estado !== "cancelada" && !isPast}
                <div class="space-y-2">
                    <label class="text-xs text-gray-600"
                        >Estado de la cita:</label
                    >
                    <select
                        value={cita.estado}
                        on:change={(e) =>
                            onCambiarEstado(cita.id, e.target.value)}
                        disabled={processingId === cita.id}
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm
                               focus:ring-2 focus:ring-black focus:border-transparent
                               disabled:opacity-50"
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
            {/if}

            <!-- Marcar Asistencia -->
            {#if canMarkAttendance || (isPast && cita.asistio !== undefined && cita.asistio !== null)}
                <div class="border-t-2 border-gray-200 pt-3">
                    <label class="text-xs text-gray-600 block mb-2">
                        Registro de asistencia:
                    </label>

                    {#if canMarkAttendance}
                        <div class="flex gap-2">
                            <button
                                on:click={() =>
                                    onMarcarAsistencia(cita.id, true)}
                                disabled={processingId === cita.id}
                                class="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg
                                       hover:bg-green-100 transition-all text-sm font-medium
                                       disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {#if processingId === cita.id}
                                    <i class="fas fa-spinner fa-spin"></i>
                                {:else}
                                    <i class="fas fa-user-check"></i>
                                    Asistió
                                {/if}
                            </button>

                            <button
                                on:click={() =>
                                    onMarcarAsistencia(cita.id, false)}
                                disabled={processingId === cita.id}
                                class="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg
                                       hover:bg-red-100 transition-all text-sm font-medium
                                       disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {#if processingId === cita.id}
                                    <i class="fas fa-spinner fa-spin"></i>
                                {:else}
                                    <i class="fas fa-user-times"></i>
                                    No Asistió
                                {/if}
                            </button>
                        </div>
                    {:else}
                        <div
                            class="text-center py-2 px-3 bg-gray-100 rounded-lg"
                        >
                            <span class="text-sm text-gray-600">
                                {cita.asistio
                                    ? "✓ Registrado como asistido"
                                    : "✗ Registrado como no asistido"}
                            </span>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
