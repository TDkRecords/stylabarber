<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { addImage, updateImage } from "../js/addImage";

    export let isEditing = false;
    export let image = {
        title: "",
        description: "",
        legend: "",
        imageUrl: "",
    };

    const dispatch = createEventDispatcher();

    let formData = { ...image };
    let isLoading = false;
    let error = null;
    let initialized = false;
    let currentImageId = null;

    // Initialize form data when component mounts or when editing a different image
    onMount(() => {
        initializeFormData();
        return () => {
            initialized = false;
        };
    });

    function initializeFormData() {
        if (!initialized || (image?.id && image.id !== currentImageId)) {
            formData = { ...image };
            currentImageId = image?.id || null;
            initialized = true;
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        formData = { ...formData, [name]: value };
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.imageUrl) {
            error = "El título y la URL de la imagen son obligatorios";
            return;
        }

        try {
            isLoading = true;
            error = null;

            if (isEditing && image?.id) {
                await updateImage({ ...formData, id: image.id });
            } else {
                await addImage(formData);
            }

            dispatch("save");
        } catch (err) {
            console.error("Error saving image:", err);
            error =
                "Error al guardar la imagen. Por favor, inténtalo de nuevo.";
        } finally {
            isLoading = false;
        }
    };

    const handleImageUrlChange = (e) => {
        formData = { ...formData, imageUrl: e.target.value };
        // Update the preview when the URL changes
        if (e.target.value) {
            image = { ...image, imageUrl: e.target.value };
        }
    };
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if error}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
        >
            <span class="block sm:inline">{error}</span>
        </div>
    {/if}

    <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
            >Título *</label
        >
        <input
            type="text"
            id="title"
            bind:value={formData.title}
            placeholder="Ingresa el título de la imagen"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
        />
    </div>

    <div>
        <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Descripción</label
        >
        <textarea
            id="description"
            bind:value={formData.description}
            placeholder="Añade una descripción"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
    </div>

    <div>
        <label for="legend" class="block text-sm font-medium text-gray-700 mb-1"
            >Leyenda</label
        >
        <input
            type="text"
            id="legend"
            bind:value={formData.legend}
            placeholder="Añade una leyenda"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>

    <div>
        <label
            for="imageUrl"
            class="block text-sm font-medium text-gray-700 mb-1"
            >URL de la Imagen *</label
        >
        <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            on:input={handleImageUrlChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
        />
        <p class="mt-1 text-sm text-gray-500">Pega la URL de la imagen aquí</p>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
        <button
            type="button"
            on:click={() => dispatch("cancel")}
            disabled={isLoading}
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            Cancelar
        </button>
        <button
            type="submit"
            disabled={isLoading}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
        </button>
    </div>
</form>
