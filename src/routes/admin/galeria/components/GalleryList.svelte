<script>
  import { createEventDispatcher } from "svelte";
  import { deleteImage } from "../js/deleteImage";

  export let images = [];

  const dispatch = createEventDispatcher();
  let deletingId = null;

  async function handleDelete(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;

    try {
      deletingId = id;
      await deleteImage(id);
      dispatch("delete");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la imagen");
    } finally {
      deletingId = null;
    }
  }

  function handleEdit(image) {
    dispatch("edit", image);
  }
</script>

{#if images.length === 0}
  <div class="text-center py-12 bg-white rounded-lg shadow">
    <i class="fas fa-images text-4xl text-gray-300 mb-3"></i>
    <p class="text-gray-500">
      No hay imágenes en la galería. ¡Añade tu primera imagen!
    </p>
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each images as image (image.id)}
      <article
        class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
        on:click={() => handleEdit(image)}
        on:keydown={(e) => e.key === "Enter" && handleEdit(image)}
        tabindex="0"
        role="button"
        aria-label={`Editar imagen: ${image.title || "Sin título"}`}
      >
        <!-- Imagen -->
        <div class="h-48 overflow-hidden bg-gray-100">
          {#if image.imageUrl}
            <img
              src={image.imageUrl}
              alt={image.title ?? "Imagen de galería"}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center">
              <i class="fas fa-image text-4xl text-gray-300"></i>
            </div>
          {/if}
        </div>

        <!-- Contenido -->
        <div class="p-4 flex gap-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-gray-900 truncate">
              {image.title || "Sin título"}
            </h3>

            {#if image.description}
              <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                {image.description}
              </p>
            {/if}

            {#if image.legend}
              <p class="mt-1 text-sm text-gray-400 italic">
                {image.legend}
              </p>
            {/if}
          </div>

          <!-- Acciones -->
          <div class="flex shrink-0 gap-1">
            <button
              class="p-2 text-indigo-600 hover:text-indigo-900"
              title="Editar"
              on:click|stopPropagation={() => handleEdit(image)}
            >
              <i class="fas fa-edit"></i>
            </button>

            <button
              class="p-2 text-red-600 hover:text-red-900 disabled:opacity-50"
              title="Eliminar"
              disabled={deletingId === image.id}
              on:click|stopPropagation={() => handleDelete(image.id)}
            >
              {#if deletingId === image.id}
                <i class="fas fa-spinner fa-spin"></i>
              {:else}
                <i class="fas fa-trash-alt"></i>
              {/if}
            </button>
          </div>
        </div>
      </article>
    {/each}
  </div>
{/if}
