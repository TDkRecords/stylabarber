<script>
    export let user;
    export let nombre = "";
    export let telefono = "";
    export let error = null;
    export let onSubmit;
</script>

<div class="bg-white shadow-xl rounded-2xl p-8 max-w-md mx-auto">
    <div class="text-center mb-6">
        <img
            src={user.photoURL}
            alt="Foto de perfil"
            class="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-200"
        />
        <h2 class="text-2xl font-bold">Completa tu perfil</h2>
        <p class="text-gray-600 mt-2">
            Para continuar, necesitamos algunos datos
        </p>
    </div>

    {#if error}
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
            <p class="text-sm text-red-700">{error}</p>
        </div>
    {/if}

    <form on:submit|preventDefault={onSubmit} class="space-y-4">
        <input
            type="text"
            bind:value={nombre}
            placeholder="Nombre completo"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
        />

        <input
            type="tel"
            bind:value={telefono}
            placeholder="3001234567"
            maxlength="10"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
        />

        <button
            type="submit"
            class="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
            Guardar y continuar
        </button>
    </form>
</div>
