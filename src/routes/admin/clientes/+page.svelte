<script>
    import { onMount } from "svelte";
    import { getClientes } from "./js/getClientes";
    import { addCliente, updateCliente } from "./js/addCliente";
    import { deleteCliente } from "./js/deleteCliente";

    let clientes = [];
    let showForm = false;
    let editingCliente = null;
    let isLoading = true;
    let error = null;
    let deletingId = null;

    // Form data
    let nombre = "";
    let telefono = "";
    let email = "";
    let notas = "";

    async function loadClientes() {
        try {
            isLoading = true;
            clientes = await getClientes();
            error = null;
        } catch (err) {
            console.error("Error loading clientes:", err);
            error = "Error al cargar los clientes";
        } finally {
            isLoading = false;
        }
    }

    function resetForm() {
        nombre = "";
        telefono = "";
        email = "";
        notas = "";
        editingCliente = null;
        showForm = false;
    }

    function handleAdd() {
        resetForm();
        showForm = true;
    }

    function handleEdit(cliente) {
        editingCliente = cliente;
        nombre = cliente.nombre || "";
        telefono = cliente.telefono || "";
        email = cliente.email || "";
        notas = cliente.notas || "";
        showForm = true;
    }

    async function handleSubmit() {
        if (!nombre.trim() || !telefono.trim()) {
            error = "Nombre y teléfono son obligatorios";
            return;
        }

        // Validar formato de teléfono (10 dígitos)
        if (!/^\d{10}$/.test(telefono.replace(/\s/g, ""))) {
            error = "El teléfono debe tener 10 dígitos";
            return;
        }

        // Validar email si se proporciona
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error = "El formato del email no es válido";
            return;
        }

        try {
            const clienteData = {
                nombre: nombre.trim(),
                telefono: telefono.trim(),
                email: email.trim(),
                notas: notas.trim(),
            };

            if (editingCliente) {
                await updateCliente({ id: editingCliente.id, ...clienteData });
            } else {
                await addCliente(clienteData);
            }

            resetForm();
            await loadClientes();
            error = null;
        } catch (err) {
            console.error("Error saving cliente:", err);
            error = "Error al guardar el cliente. Intenta nuevamente.";
        }
    }

    async function handleDelete(id) {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

        try {
            deletingId = id;
            await deleteCliente(id);
            await loadClientes();
        } catch (err) {
            console.error("Error deleting cliente:", err);
            error = "Error al eliminar el cliente";
        } finally {
            deletingId = null;
        }
    }

    onMount(() => {
        loadClientes();
    });
</script>

<div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-4 flex items-center text-sm text-gray-600">
            <a href="/admin" class="hover:text-gray-900">Admin</a>
            <i class="fas fa-chevron-right mx-2 text-xs"></i>
            <span class="text-gray-900 font-medium">Clientes</span>
        </nav>

        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Gestión de Clientes
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                    Administra la base de datos de clientes
                </p>
            </div>
            <button
                on:click={handleAdd}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
            >
                <i class="fas fa-plus mr-2"></i>
                Nuevo Cliente
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
            <div
                class="bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-gray-200"
            >
                <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h3 class="text-lg leading-6 font-semibold text-gray-900">
                        {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
                    </h3>
                </div>
                <div class="px-6 py-5">
                    <form
                        on:submit|preventDefault={handleSubmit}
                        class="space-y-5"
                    >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    bind:value={nombre}
                                    placeholder="Ej: Juan Pérez"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    bind:value={telefono}
                                    placeholder="3001234567"
                                    maxlength="10"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    10 dígitos sin espacios
                                </p>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    bind:value={email}
                                    placeholder="correo@ejemplo.com"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Notas
                                </label>
                                <input
                                    type="text"
                                    bind:value={notas}
                                    placeholder="Preferencias, alergias, etc."
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div
                            class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
                        >
                            <button
                                type="button"
                                on:click={resetForm}
                                class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                class="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                <i class="fas fa-save mr-2"></i>
                                {editingCliente ? "Actualizar" : "Guardar"}
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
        {:else if clientes.length === 0}
            <div class="text-center py-16 bg-white rounded-lg shadow">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
                >
                    <i class="fas fa-users text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No hay clientes registrados
                </h3>
                <p class="text-gray-500 mb-6">
                    Comienza agregando tu primer cliente
                </p>
                <button
                    on:click={handleAdd}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                    <i class="fas fa-plus mr-2"></i>
                    Agregar Cliente
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
                                    >Nombre</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Teléfono</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Email</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Notas</th
                                >
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >Acciones</th
                                >
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#each clientes as cliente (cliente.id)}
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div
                                                class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"
                                            >
                                                <span
                                                    class="text-blue-600 font-semibold"
                                                >
                                                    {cliente.nombre
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div class="ml-4">
                                                <div
                                                    class="text-sm font-medium text-gray-900"
                                                >
                                                    {cliente.nombre}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                    >
                                        <i
                                            class="fas fa-phone mr-2 text-gray-400"
                                        ></i>
                                        {cliente.telefono}
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                    >
                                        {#if cliente.email}
                                            <i
                                                class="fas fa-envelope mr-2 text-gray-400"
                                            ></i>
                                            {cliente.email}
                                        {:else}
                                            <span class="text-gray-400">-</span>
                                        {/if}
                                    </td>
                                    <td
                                        class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                                    >
                                        {cliente.notas || "-"}
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                    >
                                        <button
                                            on:click={() => handleEdit(cliente)}
                                            class="text-blue-600 hover:text-blue-900 mr-4 transition"
                                            title="Editar"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button
                                            on:click={() =>
                                                handleDelete(cliente.id)}
                                            disabled={deletingId === cliente.id}
                                            class="text-red-600 hover:text-red-900 disabled:opacity-50 transition"
                                            title="Eliminar"
                                        >
                                            {#if deletingId === cliente.id}
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

                <!-- Pagination info -->
                <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <p class="text-sm text-gray-600">
                        Mostrando <span class="font-medium"
                            >{clientes.length}</span
                        >
                        cliente{clientes.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        {/if}
    </div>
</div>
