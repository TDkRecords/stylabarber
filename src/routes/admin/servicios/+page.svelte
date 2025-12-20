<script>
    import { onMount } from "svelte";
    import { getServicios } from "./js/getServicios";
    import { addServicio, updateServicio } from "./js/addServicio";
    import { deleteServicio } from "./js/deleteServicio";

    let servicios = [];
    let showForm = false;
    let editingServicio = null;
    let isLoading = true;
    let error = null;
    let deletingId = null;
    let formError = null;

    // Form data
    let nombre = "";
    let descripcion = "";
    let precio = null;
    let duracion = null;

    async function loadServicios() {
        try {
            isLoading = true;
            servicios = await getServicios();
            error = null;
        } catch (err) {
            console.error("Error loading servicios:", err);
            error = "Error al cargar los servicios";
        } finally {
            isLoading = false;
        }
    }

    function resetForm() {
        nombre = "";
        descripcion = "";
        precio = null;
        duracion = null;
        editingServicio = null;
        formError = null;
    }

    function closeForm() {
        resetForm();
        showForm = false;
    }

    function handleAdd() {
        resetForm();
        showForm = true;
    }

    function handleEdit(servicio) {
        editingServicio = servicio;
        nombre = servicio.nombre || "";
        descripcion = servicio.descripcion || "";
        precio = servicio.precio || "";
        duracion = servicio.duracion || "";
        showForm = true;
        formError = null;
    }

    async function handleSubmit() {
        formError = null;

        // Validaciones
        if (!nombre.trim()) {
            formError = "El nombre es obligatorio";
            return;
        }

        if (precio == null || precio === "") {
            formError = "El precio es obligatorio";
            return;
        }

        if (duracion == null || duracion === "") {
            formError = "La duración es obligatoria";
            return;
        }

        if (Number(precio) <= 0) {
            formError = "El precio debe ser mayor a 0";
            return;
        }

        if (Number(duracion) < 15) {
            formError = "La duración mínima es 15 minutos";
            return;
        }

        const servicioData = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            duracion: Number(duracion),
        };

        try {
            if (editingServicio) {
                await updateServicio({
                    id: editingServicio.id,
                    ...servicioData,
                });
            } else {
                await addServicio(servicioData);
            }

            closeForm();
            await loadServicios();
        } catch (err) {
            console.error("Error guardando servicio:", err);
            formError = "Error al guardar el servicio. Intenta nuevamente.";
        }
    }

    async function handleDelete(id) {
        if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

        try {
            deletingId = id;
            await deleteServicio(id);
            await loadServicios();
        } catch (err) {
            console.error("Error deleting servicio:", err);
            error = "Error al eliminar el servicio";
        } finally {
            deletingId = null;
        }
    }

    onMount(() => {
        loadServicios();
    });
</script>

<div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-4 flex items-center text-sm text-gray-600">
            <a href="/admin" class="hover:text-gray-900">Admin</a>
            <i class="fas fa-chevron-right mx-2 text-xs"></i>
            <span class="text-gray-900 font-medium">Servicios</span>
        </nav>

        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Gestión de Servicios
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                    Administra los servicios de la barbería
                </p>
            </div>
            <button
                on:click={handleAdd}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition"
            >
                <i class="fas fa-plus mr-2"></i>
                Nuevo Servicio
            </button>
        </div>

        {#if error}
            <div
                class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg"
            >
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-red-400 mr-3"></i>
                    <p class="text-sm text-red-700">{error}</p>
                    <button
                        on:click={() => (error = null)}
                        class="ml-auto text-red-400 hover:text-red-600"
                        aria-label="Cerrar mensaje de error"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        {/if}

        {#if showForm}
            <div
                class="bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-gray-200"
            >
                <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h3 class="text-lg leading-6 font-semibold text-gray-900">
                        {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
                    </h3>
                </div>

                <div class="px-6 py-5">
                    {#if formError}
                        <div
                            class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6"
                        >
                            <div class="flex items-center">
                                <i
                                    class="fas fa-exclamation-circle text-red-400 mr-3"
                                ></i>
                                <p class="text-sm text-red-700">{formError}</p>
                            </div>
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={handleSubmit}
                        class="space-y-5"
                    >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    for="nombre"
                                >
                                    Nombre del Servicio *
                                </label>
                                <input
                                    id="nombre"
                                    type="text"
                                    bind:value={nombre}
                                    placeholder="Ej: Corte Clásico"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    for="precio"
                                >
                                    Precio (COP) *
                                </label>
                                <input
                                    id="precio"
                                    type="number"
                                    bind:value={precio}
                                    placeholder="Ej: 25000"
                                    step="1000"
                                    min="1000"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    Precio en pesos colombianos
                                </p>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    for="duracion"
                                >
                                    Duración (minutos) *
                                </label>
                                <input
                                    id="duracion"
                                    type="number"
                                    bind:value={duracion}
                                    placeholder="Ej: 30"
                                    step="15"
                                    min="15"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    Mínimo 15 minutos
                                </p>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                    for="descripcion"
                                >
                                    Descripción
                                </label>
                                <input
                                    id="descripcion"
                                    type="text"
                                    bind:value={descripcion}
                                    placeholder="Breve descripción del servicio"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div
                            class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
                        >
                            <button
                                type="button"
                                on:click={closeForm}
                                class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                class="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
                            >
                                <i class="fas fa-save mr-2"></i>
                                {editingServicio ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        {/if}

        {#if isLoading}
            <div class="flex justify-center items-center py-12">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
                ></div>
            </div>
        {:else if servicios.length === 0}
            <div class="text-center py-16 bg-white rounded-lg shadow">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
                >
                    <i class="fas fa-cut text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No hay servicios registrados
                </h3>
                <p class="text-gray-500 mb-6">
                    Comienza agregando tu primer servicio
                </p>
                <button
                    on:click={handleAdd}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                >
                    <i class="fas fa-plus mr-2"></i>
                    Agregar Servicio
                </button>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each servicios as servicio (servicio.id)}
                    <div
                        class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition group"
                    >
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex-1">
                                    <h3
                                        class="text-xl font-bold text-gray-900 mb-2"
                                    >
                                        {servicio.nombre}
                                    </h3>
                                    {#if servicio.descripcion}
                                        <p class="text-sm text-gray-600 mb-4">
                                            {servicio.descripcion}
                                        </p>
                                    {/if}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-between pt-4 border-t border-gray-200"
                            >
                                <div class="flex items-center text-gray-600">
                                    <i class="fas fa-clock mr-2"></i>
                                    <span class="text-sm font-medium"
                                        >{servicio.duracion} min</span
                                    >
                                </div>
                                <div class="text-2xl font-bold text-green-600">
                                    ${servicio.precio.toLocaleString("es-CO")}
                                </div>
                            </div>

                            <div
                                class="flex gap-2 mt-4 pt-4 border-t border-gray-200"
                            >
                                <button
                                    on:click={() => handleEdit(servicio)}
                                    class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                >
                                    <i class="fas fa-edit mr-2"></i>
                                    Editar
                                </button>
                                <button
                                    on:click={() => handleDelete(servicio.id)}
                                    disabled={deletingId === servicio.id}
                                    class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50 text-sm font-medium"
                                >
                                    {#if deletingId === servicio.id}
                                        <i class="fas fa-spinner fa-spin mr-2"
                                        ></i>
                                        Eliminando...
                                    {:else}
                                        <i class="fas fa-trash-alt mr-2"></i>
                                        Eliminar
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
