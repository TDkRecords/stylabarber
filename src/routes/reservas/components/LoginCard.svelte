<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
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
        on:click|preventDefault={() => dispatch("login")}
        class="flex items-center justify-center gap-3 w-full bg-white shadow-lg border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition active:scale-95"
    >
        <i class="fab fa-google text-xl text-red-500"></i>
        Iniciar sesión con Google
    </button>
</div>
