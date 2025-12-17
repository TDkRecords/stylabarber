<script>
    export let user;
    export let profile;
    export let onLogout;
</script>

<div
    class="bg-linear-to-r from-black to-gray-800 text-white shadow-xl rounded-2xl p-6"
>
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div class="flex items-center gap-4">
            <div class="relative">
                <img
                    src={user.photoURL}
                    alt="Foto de perfil"
                    class="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg"
                />
                <div
                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                ></div>
            </div>
            <div>
                <h3 class="font-bold text-xl">{profile.nombre}</h3>
                <p class="text-white/80 text-sm flex items-center gap-2 mt-1">
                    <i class="fas fa-phone"></i>
                    {profile.telefono}
                </p>
                <p class="text-white/60 text-xs mt-1 flex items-center gap-2">
                    <i class="fas fa-envelope"></i>
                    {user.email}
                </p>
            </div>
        </div>

        <button
            on:click={onLogout}
            class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20
                   rounded-lg transition-all font-medium text-sm border border-white/20
                   hover:border-white/40 active:scale-95"
        >
            <i class="fas fa-sign-out-alt"></i>
            Cerrar Sesión
        </button>
    </div>
</div>
