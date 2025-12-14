<script>
    import { createEventDispatcher } from "svelte";

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
    let previewUrl = formData.imageUrl;

    const handleInput = (field, value) => {
        formData = { ...formData, [field]: value };
        if (field === "imageUrl") {
            previewUrl = value;
        }
    };

    const handleSubmit = async () => {
        // Validaciones
        if (!formData.title.trim()) {
            error = "El título es obligatorio";
            return;
        }

        if (!formData.imageUrl.trim()) {
            error = "La URL de la imagen es obligatoria";
            return;
        }

        // Validar que sea una URL válida
        try {
            new URL(formData.imageUrl);
        } catch {
            error = "La URL de la imagen no es válida";
            return;
        }

        try {
            isLoading = true;
            error = null;

            dispatch("save", {
                title: formData.title.trim(),
                description: formData.description.trim(),
                legend: formData.legend.trim(),
                imageUrl: formData.imageUrl.trim(),
            });
        } catch (err) {
            console.error("Error saving image:", err);
            error =
                "Error al guardar la imagen. Por favor, inténtalo de nuevo.";
        } finally {
            isLoading = false;
        }
    };
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-5">
    {#if error}
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div class="flex">
                <i class="fas fa-exclamation-circle text-red-400 mr-3"></i>
                <p class="text-sm text-red-700">{error}</p>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
            <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Título *
            </label>
            <input
                type="text"
                id="title"
                value={formData.title}
                on:input={(e) => handleInput("title", e.target.value)}
                placeholder="Ej: Corte degradado"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
            />
        </div>

        <div class="md:col-span-2">
            <label
                for="imageUrl"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                URL de la Imagen *
            </label>
            <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                on:input={(e) => handleInput("imageUrl", e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
            />
            <p class="mt-1 text-xs text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Pega la URL completa de la imagen
            </p>
        </div>

        <!-- Preview de la imagen -->
        {#if previewUrl}
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Vista Previa
                </label>
                <div
                    class="relative w-full max-w-md mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300"
                >
                    <img
                        src={previewUrl}
                        alt="Preview"
                        class="w-full h-full object-cover"
                        on:error={() => {
                            previewUrl = null;
                            error =
                                "No se pudo cargar la imagen. Verifica la URL.";
                        }}
                    />
                </div>
            </div>
        {/if}

        <div class="md:col-span-2">
            <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Descripción
            </label>
            <textarea
                id="description"
                value={formData.description}
                on:input={(e) => handleInput("description", e.target.value)}
                placeholder="Descripción detallada del trabajo"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            ></textarea>
        </div>

        <div class="md:col-span-2">
            <label
                for="legend"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Leyenda
            </label>
            <input
                type="text"
                id="legend"
                value={formData.legend}
                on:input={(e) => handleInput("legend", e.target.value)}
                placeholder="Texto corto para la imagen"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
        </div>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
            type="button"
            on:click={() => dispatch("cancel")}
            disabled={isLoading}
            class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
            Cancelar
        </button>
        <button
            type="submit"
            disabled={isLoading}
            class="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 transition disabled:opacity-50 inline-flex items-center"
        >
            {#if isLoading}
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Guardando...
            {:else}
                <i class="fas fa-save mr-2"></i>
                {isEditing ? "Actualizar" : "Guardar"}
            {/if}
        </button>
    </div>
</form>
