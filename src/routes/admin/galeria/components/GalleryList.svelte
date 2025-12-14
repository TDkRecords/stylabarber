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
  <div class="text-center py-16 bg-white rounded-lg shadow">
    <div
      class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
    >
      <i class="fas fa-images text-3xl text-gray-400"></i>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      No hay imágenes en la galería
    </h3>
    <p class="text-gray-500">¡Añade tu primera imagen!</p>
  </div>
{:else}
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    {#each images as image (image.id)}
      <div
        class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
      >
        <!-- Imagen -->
        <div class="relative h-64 overflow-hidden bg-gray-100">
          {#if image.imageUrl}
            <img
              src={image.imageUrl}
              alt={image.title ?? "Imagen de galería"}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center">
              <i class="fas fa-image text-5xl text-gray-300"></i>
            </div>
          {/if}

          <!-- Overlay con acciones -->
          <div
            class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
          >
            <button
              on:click={() => handleEdit(image)}
              class="bg-white text-blue-600 hover:bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center transition shadow-lg"
              title="Editar"
            >
              <i class="fas fa-edit text-lg"></i>
            </button>

            <button
              on:click={() => handleDelete(image.id)}
              disabled={deletingId === image.id}
              class="bg-white text-red-600 hover:bg-red-50 rounded-full w-12 h-12 flex items-center justify-center transition shadow-lg disabled:opacity-50"
              title="Eliminar"
            >
              {#if deletingId === image.id}
                <i class="fas fa-spinner fa-spin text-lg"></i>
              {:else}
                <i class="fas fa-trash-alt text-lg"></i>
              {/if}
            </button>
          </div>
        </div>

        <!-- Información -->
        <div class="p-4">
          <h3 class="text-base font-semibold text-gray-900 truncate mb-2">
            {image.title || "Sin título"}
          </h3>

          {#if image.description}
            <p class="text-sm text-gray-600 line-clamp-2 mb-2">
              {image.description}
            </p>
          {/if}

          {#if image.legend}
            <p class="text-xs text-gray-500 italic line-clamp-1">
              {image.legend}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Resumen -->
  <div class="mt-8 text-center">
    <p class="text-sm text-gray-600">
      Total: <span class="font-semibold text-gray-900">{images.length}</span>
      imagen{images.length !== 1 ? "es" : ""}
    </p>
  </div>
{/if}
