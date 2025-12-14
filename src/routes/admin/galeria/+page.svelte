<script>
    import { onMount } from "svelte";
    import GalleryList from "./components/GalleryList.svelte";
    import GalleryForm from "./components/GalleryForm.svelte";
    import { getImages } from "./js/getImage";
    import { addImage, updateImage } from "./js/addImage";

    let images = [];
    let selectedImage = null;
    let isLoading = true;
    let error = null;
    let showForm = false;
    let successMessage = null;

    async function loadImages() {
        try {
            isLoading = true;
            images = await getImages();
            error = null;
        } catch (err) {
            console.error("Error loading images:", err);
            error = "Error al cargar las imágenes";
        } finally {
            isLoading = false;
        }
    }

    function handleAdd() {
        selectedImage = null;
        showForm = true;
        error = null;
        successMessage = null;
    }

    function handleEdit(event) {
        selectedImage = { ...event.detail };
        showForm = true;
        error = null;
        successMessage = null;
    }

    async function handleSave(event) {
        try {
            const imageData = event.detail;

            if (selectedImage) {
                await updateImage({ id: selectedImage.id, ...imageData });
                successMessage = "Imagen actualizada correctamente";
            } else {
                await addImage(imageData);
                successMessage = "Imagen agregada correctamente";
            }

            showForm = false;
            await loadImages();

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
                successMessage = null;
            }, 3000);
        } catch (err) {
            console.error("Error saving image:", err);
            error = "Error al guardar la imagen";
        }
    }

    function handleCancel() {
        showForm = false;
        selectedImage = null;
        error = null;
    }

    onMount(() => {
        loadImages();
    });
</script>

<div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-4 flex items-center text-sm text-gray-600">
            <a href="/admin" class="hover:text-gray-900">Admin</a>
            <i class="fas fa-chevron-right mx-2 text-xs"></i>
            <span class="text-gray-900 font-medium">Galería</span>
        </nav>

        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Gestión de Galería
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                    Administra las imágenes de la galería pública
                </p>
            </div>
            <button
                on:click={handleAdd}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition"
            >
                <i class="fas fa-plus mr-2"></i>
                Agregar Imagen
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
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        {/if}

        {#if successMessage}
            <div
                class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg"
            >
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-400 mr-3"></i>
                    <p class="text-sm text-green-700">{successMessage}</p>
                    <button
                        on:click={() => (successMessage = null)}
                        class="ml-auto text-green-400 hover:text-green-600"
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
                        {selectedImage ? "Editar Imagen" : "Nueva Imagen"}
                    </h3>
                </div>
                <div class="px-6 py-5">
                    <GalleryForm
                        image={selectedImage}
                        isEditing={!!selectedImage}
                        on:save={handleSave}
                        on:cancel={handleCancel}
                    />
                </div>
            </div>
        {/if}

        {#if isLoading}
            <div class="flex justify-center items-center py-12">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"
                ></div>
            </div>
        {:else}
            <GalleryList {images} on:edit={handleEdit} on:delete={loadImages} />
        {/if}
    </div>
</div>
