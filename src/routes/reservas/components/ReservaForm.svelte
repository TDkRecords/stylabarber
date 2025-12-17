<script>
    export let servicios = [];
    export let horarios = [];
    export let citasExistentes = [];
    export let selectedService = null;
    export let selectedDate = "";
    export let selectedTime = "";
    export let availableTimes = [];
    export let isSubmitting = false;
    export let onSubmit;

    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // Obtener fecha mínima (hoy) - Corregir para zona horaria local
    const today = (() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split("T")[0];
    })();

    // Obtener fecha máxima (30 días adelante)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    function getHorarioForDate(date) {
        if (!date) return null;
        // Crear fecha en zona horaria local para evitar desfases
        const [year, month, day] = date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        const dayIndex = localDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.

        console.log("Fecha seleccionada:", date);
        console.log(
            "Día de la semana (índice):",
            dayIndex,
            "=",
            diasSemana[dayIndex],
        );

        const horario = horarios.find((h) => h.dia === diasSemana[dayIndex]);
        console.log("Horario encontrado:", horario);

        return horario;
    }

    function isDayAvailable(date) {
        const horario = getHorarioForDate(date);
        return horario && !horario.cerrado;
    }

    // Reactivo: resetear hora cuando cambia servicio o fecha
    $: if (selectedService || selectedDate) {
        selectedTime = "";
    }

    // Validación del formulario
    $: canSubmit =
        selectedService && selectedDate && selectedTime && !isSubmitting;
</script>

<div class="bg-white shadow-xl rounded-2xl p-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
        <i class="fas fa-calendar-plus text-black"></i>
        Nueva Reserva
    </h2>

    <form on:submit|preventDefault={onSubmit} class="space-y-6">
        <!-- SELECCIÓN DE SERVICIO -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
                <i class="fas fa-cut mr-2 text-gray-500"></i>
                Selecciona un servicio *
            </label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each servicios as servicio (servicio.id)}
                    <button
                        type="button"
                        on:click={() => (selectedService = servicio)}
                        class="relative p-4 border-2 rounded-xl transition-all text-left
                            {selectedService?.id === servicio.id
                            ? 'border-black bg-black/5 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}"
                    >
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="font-semibold text-lg">
                                {servicio.nombre}
                            </h3>
                            {#if selectedService?.id === servicio.id}
                                <i
                                    class="fas fa-check-circle text-black text-xl"
                                ></i>
                            {/if}
                        </div>

                        {#if servicio.descripcion}
                            <p class="text-sm text-gray-600 mb-3">
                                {servicio.descripcion}
                            </p>
                        {/if}

                        <div
                            class="flex items-center justify-between pt-3 border-t border-gray-200"
                        >
                            <span
                                class="text-sm text-gray-600 flex items-center gap-1"
                            >
                                <i class="fas fa-clock"></i>
                                {servicio.duracion} min
                            </span>
                            <span class="text-lg font-bold text-green-600">
                                ${servicio.precio.toLocaleString("es-CO")}
                            </span>
                        </div>
                    </button>
                {/each}
            </div>

            {#if servicios.length === 0}
                <p class="text-gray-500 text-center py-8">
                    <i class="fas fa-info-circle mr-2"></i>
                    No hay servicios disponibles
                </p>
            {/if}
        </div>

        <!-- SELECCIÓN DE FECHA -->
        {#if selectedService}
            <div class="animate-fadeIn">
                <label
                    for="fecha"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                >
                    <i class="fas fa-calendar-day mr-2 text-gray-500"></i>
                    Selecciona una fecha *
                </label>

                <input
                    type="date"
                    id="fecha"
                    bind:value={selectedDate}
                    min={today}
                    max={maxDateStr}
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-base"
                    required
                />

                {#if selectedDate}
                    {@const horario = getHorarioForDate(selectedDate)}
                    {#if horario && horario.cerrado}
                        <div
                            class="mt-3 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                        >
                            <p class="text-sm text-red-700">
                                <i class="fas fa-times-circle mr-2"></i>
                                Lo sentimos, estamos cerrados este día. Por favor
                                selecciona otra fecha.
                            </p>
                        </div>
                    {:else if horario}
                        <div
                            class="mt-3 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
                        >
                            <p class="text-sm text-green-700">
                                <i class="fas fa-check-circle mr-2"></i>
                                Horario disponible: {horario.horaApertura} - {horario.horaCierre}
                            </p>
                        </div>
                    {/if}
                {/if}
            </div>
        {/if}

        <!-- SELECCIÓN DE HORA -->
        {#if selectedService && selectedDate && isDayAvailable(selectedDate)}
            <div class="animate-fadeIn">
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                    <i class="fas fa-clock mr-2 text-gray-500"></i>
                    Selecciona una hora *
                </label>

                {#if availableTimes.length === 0}
                    <div
                        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
                    >
                        <p class="text-sm text-yellow-700">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            No hay horarios disponibles para esta fecha. Intenta
                            con otro día.
                        </p>
                    </div>
                {:else}
                    <div
                        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                    >
                        {#each availableTimes as time}
                            <button
                                type="button"
                                on:click={() => (selectedTime = time)}
                                class="px-4 py-3 border-2 rounded-xl font-medium transition-all
                                    {selectedTime === time
                                    ? 'border-black bg-black text-white shadow-lg'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}"
                            >
                                {time}
                            </button>
                        {/each}
                    </div>

                    <p
                        class="mt-3 text-sm text-gray-500 flex items-center gap-2"
                    >
                        <i class="fas fa-info-circle"></i>
                        {availableTimes.length} horario{availableTimes.length !==
                        1
                            ? "s"
                            : ""} disponible{availableTimes.length !== 1
                            ? "s"
                            : ""}
                    </p>
                {/if}
            </div>
        {/if}

        <!-- RESUMEN DE LA RESERVA -->
        {#if selectedService && selectedDate && selectedTime}
            <div
                class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 animate-fadeIn"
            >
                <h3 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-clipboard-list"></i>
                    Resumen de tu reserva
                </h3>

                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Servicio:</span>
                        <span class="font-semibold"
                            >{selectedService.nombre}</span
                        >
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Fecha:</span>
                        <span class="font-semibold">
                            {new Date(selectedDate).toLocaleDateString(
                                "es-CO",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </span>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Hora:</span>
                        <span class="font-semibold">{selectedTime}</span>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Duración:</span>
                        <span class="font-semibold"
                            >{selectedService.duracion} min</span
                        >
                    </div>

                    <div
                        class="flex justify-between items-center pt-3 border-t-2 border-gray-300"
                    >
                        <span class="text-gray-700 font-semibold">Total:</span>
                        <span class="text-2xl font-bold text-green-600">
                            ${selectedService.precio.toLocaleString("es-CO")}
                        </span>
                    </div>
                </div>
            </div>
        {/if}

        <!-- BOTÓN DE ENVÍO -->
        <button
            type="submit"
            disabled={!canSubmit}
            class="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg
                transition-all disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]
                flex items-center justify-center gap-3"
        >
            {#if isSubmitting}
                <i class="fas fa-spinner fa-spin"></i>
                Procesando reserva...
            {:else if canSubmit}
                <i class="fas fa-check-circle"></i>
                Confirmar Reserva
            {:else}
                <i class="fas fa-calendar-plus"></i>
                Completa el formulario
            {/if}
        </button>
    </form>
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
</style>
