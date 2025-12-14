<script>
    export let user;
    export let profile;
    export let onLogout;
</script>

<div
    class="bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center"
>
    <div class="flex items-center gap-4">
        <img
            src={user.photoURL}
            class="w-14 h-14 rounded-full border-2 border-gray-200"
        />
        <div>
            <h3 class="font-semibold">{profile.nombre}</h3>
            <p class="text-sm text-gray-600">{profile.telefono}</p>
        </div>
    </div>

    <button on:click={onLogout} class="text-red-600 font-medium">
        <i class="fas fa-sign-out-alt mr-2"></i> Salir
    </button>
</div>
