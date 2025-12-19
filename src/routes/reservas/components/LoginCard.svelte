<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let isLoading = false;

    async function handleLogin() {
        isLoading = true;
        try {
            await dispatch("login");
        } finally {
            // Solo quitar loading si no estamos en redirect
            setTimeout(() => {
                isLoading = false;
            }, 1000);
        }
    }
</script>

<div class="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md mx-auto">
    <div
        class="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6"
    >
        <i class="fas fa-calendar-check text-3xl text-black"></i>
    </div>

    <h2 class="text-2xl font-bold mb-3">Reserva tu cita</h2>
    <p class="text-gray-600 mb-8">Inicia sesión con Google para continuar</p>

    <button
        type="button"
        on:click={handleLogin}
        disabled={isLoading}
        class="flex items-center justify-center gap-3 w-full bg-white shadow-lg border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
        {#if isLoading}
            <i class="fas fa-spinner fa-spin text-xl text-gray-600"></i>
            <span>Iniciando sesión...</span>
        {:else}
            <i class="fab fa-google text-xl text-red-500"></i>
            <span>Iniciar sesión con Google</span>
        {/if}
    </button>

    <p class="text-xs text-gray-500 mt-4">
        <i class="fas fa-lock mr-1"></i>
        Tu información está segura y protegida
    </p>
</div>
