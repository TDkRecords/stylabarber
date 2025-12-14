<script>
    import { onMount } from "svelte";
    import { getHorarios } from "./js/getHorarios";
    import { addHorario, updateHorario } from "./js/addHorario";
    import { deleteHorario } from "./js/deleteHorario";

    let horarios = [];
    let showForm = false;
    let editingHorario = null;
    let isLoading = true;
    let error = null;
    let deletingId = null;

    // Form data
    let dia = "";
    let horaApertura = "";
    let horaCierre = "";
    let cerrado = false;

    const diasSemana = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ];

    async function loadHorarios() {
        try {
            isLoading = true;
            horarios = await getHorarios();
            error = null;
        } catch (err) {
            console.error("Error loading horarios:", err);
            error = "Error al cargar los horarios";
        } finally {
            isLoading = false;
        }
    }

    function resetForm() {
        dia = "";
        horaApertura = "";
        horaCierre = "";
        cerrado = false;
        editingHorario = null;
        showForm = false;
    }

    function handleAdd() {
        resetForm();
        showForm = true;
    }

    function handleEdit(horario) {
        editingHorario = horario;
        dia = horario.dia || "";
        horaApertura = horario.horaApertura || "";
        horaCierre = horario.horaCierre || "";
        cerrado = horario.cerrado || false;
        showForm = true;
    }

    async function handleSubmit() {
        if (!dia) {
            error = "El día es obligatorio";
            return;
        }

        if (!cerrado && (!horaApertura || !horaCierre)) {
            error =
                "Las horas de apertura y cierre son obligatorias si no está cerrado";
            return;
        }

        try {
            const horarioData = {
                dia,
                horaApertura: cerrado ? "" : horaApertura,
                horaCierre: cerrado ? "" : horaCierre,
                cerrado,
            };

            if (editingHorario) {
                await updateHorario({ id: editingHorario.id, ...horarioData });
            } else {
                await addHorario(horarioData);
            }

            resetForm();
            await loadHorarios();
        } catch (err) {
            console.error("Error saving horario:", err);
            error = "Error al guardar el horario";
        }
    }

    async function handleDelete(id) {
        if (!confirm("¿Estás seguro de eliminar este horario?")) return;

        try {
            deletingId = id;
            await deleteHorario(id);
            await loadHorarios();
        } catch (err) {
            console.error("Error deleting horario:", err);
            error = "Error al eliminar el horario";
        } finally {
            deletingId = null;
        }
    }

    onMount(() => {
        loadHorarios();
    });
</script>

<div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-4 flex items-center text-sm text-gray-600">
            <a href="/admin" class="hover:text-gray-900">Admin</a>
            <i class="fas fa-chevron-right mx-2 text-xs"></i>
            <span class="text-gray-900 font-medium">Horarios</span>
        </nav>

        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Gestión de Horarios
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                    Configura los horarios de atención
                </p>
            </div>
            <button
                on:click={handleAdd}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition"
            >
                <i class="fas fa-plus mr-2"></i>
                Nuevo Horario
            </button>
        </div>

        {#if error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <i class="fas fa-exclamation-circle text-red-400"></i>
                    <p class="ml-3 text-sm text-red-700">{error}</p>
                </div>
            </div>
        {/if}

        {#if showForm}
            <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div class="px-4 py-5 sm:p-6">
                    <h3
                        class="text-lg leading-6 font-medium text-gray-900 mb-4"
                    >
                        {editingHorario ? "Editar Horario" : "Nuevo Horario"}
                    </h3>
                    <form
                        on:submit|preventDefault={handleSubmit}
                        class="space-y-4"
                    >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Día de la Semana *
                                </label>
                                <select
                                    bind:value={dia}
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Selecciona un día</option>
                                    {#each diasSemana as d}
                                        <option value={d}>{d}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    bind:checked={cerrado}
                                    id="cerrado"
                                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <label
                                    for="cerrado"
                                    class="ml-2 block text-sm text-gray-900"
                                >
                                    Cerrado este día
                                </label>
                            </div>

                            {#if !cerrado}
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Hora de Apertura *
                                    </label>
                                    <input
                                        type="time"
                                        bind:value={horaApertura}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required={!cerrado}
                                    />
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Hora de Cierre *
                                    </label>
                                    <input
                                        type="time"
                                        bind:value={horaCierre}
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required={!cerrado}
                                    />
                                </div>
                            {/if}
                        </div>

                        <div class="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                on:click={resetForm}
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {editingHorario ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        {/if}

        {#if isLoading}
            <div class="flex justify-center items-center py-12">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
                ></div>
            </div>
        {:else if horarios.length === 0}
            <div class="text-center py-16 bg-white rounded-lg shadow">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
                >
                    <i class="fas fa-clock text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No hay horarios configurados
                </h3>
                <p class="text-gray-500 mb-6">
                    Comienza configurando los horarios de atención
                </p>
                <button
                    on:click={handleAdd}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700"
                >
                    <i class="fas fa-plus mr-2"></i>
                    Agregar Horario
                </button>
            </div>
        {:else}
            <div
                class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Día</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Horario</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Estado</th
                                >
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Acciones</th
                                >
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#each horarios as horario (horario.id)}
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div
                                                class="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center"
                                            >
                                                <i
                                                    class="fas fa-calendar-day text-purple-600"
                                                ></i>
                                            </div>
                                            <div class="ml-4">
                                                <div
                                                    class="text-sm font-semibold text-gray-900"
                                                >
                                                    {horario.dia}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                    >
                                        {#if horario.cerrado}
                                            <span class="text-gray-400">-</span>
                                        {:else}
                                            <i
                                                class="fas fa-clock mr-2 text-gray-400"
                                            ></i>
                                            {horario.horaApertura} - {horario.horaCierre}
                                        {/if}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        {#if horario.cerrado}
                                            <span
                                                class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 inline-flex items-center"
                                            >
                                                <i
                                                    class="fas fa-times-circle mr-1"
                                                ></i>
                                                Cerrado
                                            </span>
                                        {:else}
                                            <span
                                                class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 inline-flex items-center"
                                            >
                                                <i
                                                    class="fas fa-check-circle mr-1"
                                                ></i>
                                                Abierto
                                            </span>
                                        {/if}
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                    >
                                        <button
                                            on:click={() => handleEdit(horario)}
                                            class="text-purple-600 hover:text-purple-900 mr-4 transition"
                                            title="Editar"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            on:click={() =>
                                                handleDelete(horario.id)}
                                            disabled={deletingId === horario.id}
                                            class="text-red-600 hover:text-red-900 disabled:opacity-50 transition"
                                            title="Eliminar"
                                        >
                                            {#if deletingId === horario.id}
                                                <i
                                                    class="fas fa-spinner fa-spin"
                                                ></i>
                                            {:else}
                                                <i class="fas fa-trash-alt"></i>
                                            {/if}
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>
