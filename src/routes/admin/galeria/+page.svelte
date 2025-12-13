<script>
    import { onMount } from "svelte";
    import GalleryList from "./components/GalleryList.svelte";
    import GalleryForm from "./components/GalleryForm.svelte";
    import { getImages } from "./js/getImage";
    import { addImage, updateImage as editImage } from "./js/addImage";

    let images = [];
    let selectedImage = null;
    let isLoading = true;
    let error = null;
    let showForm = false;

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
    }

    function handleEdit(image) {
        selectedImage = { ...image };
        showForm = true;
    }

    async function handleSave(imageData) {
        try {
            if (selectedImage) {
                await editImage(selectedImage.id, imageData);
            } else {
                await addImage(imageData);
            }
            showForm = false;
            await loadImages();
        } catch (err) {
            console.error("Error saving image:", err);
            error = "Error al guardar la imagen";
        }
    }

    onMount(() => {
        loadImages();
    });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Galería de Imágenes</h1>
        <button
            on:click={handleAdd}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <i class="fas fa-plus mr-2"></i>
            Agregar Imagen
        </button>
    </div>

    {#if error}
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div class="flex">
                <div class="shrink-0">
                    <i class="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700">{error}</p>
                </div>
            </div>
        </div>
    {/if}

    {#if showForm}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {selectedImage ? "Editar Imagen" : "Nueva Imagen"}
                </h3>
                <GalleryForm
                    onSave={handleSave}
                    onCancel={() => (showForm = false)}
                    {selectedImage}
                />
            </div>
        </div>
    {/if}

    {#if isLoading}
        <div class="flex justify-center items-center py-12">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
            ></div>
        </div>
    {:else}
        <GalleryList
            {images}
            on:edit={({ detail }) => handleEdit(detail)}
            on:delete={loadImages}
        />
    {/if}
</div>
