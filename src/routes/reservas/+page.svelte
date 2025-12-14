<script>
    import { auth } from "$lib/js/firebase";
    import {
        GoogleAuthProvider,
        signInWithPopup,
        onAuthStateChanged,
        signOut,
    } from "firebase/auth";

    let user = null;
    let loading = true;

    const provider = new GoogleAuthProvider();

    async function loginWithGoogle() {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión con Google");
        }
    }

    async function logout() {
        await signOut(auth);
    }

    onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        loading = false;
    });
</script>

<section
    class="w-full min-h-screen flex items-center justify-center bg-gray-50 px-6"
>
    {#if loading}
        <p class="text-gray-500 text-lg">Cargando...</p>
    {:else if user}
        <!-- USUARIO LOGUEADO -->
        <div
            class="bg-white shadow-xl rounded-2xl p-8 text-center max-w-sm w-full"
        >
            <img
                src={user.photoURL}
                alt="Foto de perfil"
                class="w-24 h-24 rounded-full mx-auto mb-4"
            />

            <h2 class="text-xl font-bold">{user.displayName}</h2>
            <p class="text-gray-500 mb-6">{user.email}</p>

            <button
                on:click={logout}
                class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
            >
                Cerrar sesión
            </button>
        </div>
    {:else}
        <!-- NO LOGUEADO -->
        <button
            on:click={loginWithGoogle}
            class="flex items-center gap-3 bg-white shadow-xl border border-gray-200 px-4 py-3 rounded-2xl text-lg font-semibold hover:shadow-2xl transition active:scale-95 cursor-pointer"
        >
            <i class="fa-brands fa-google text-xl"></i>
            Iniciar sesión
        </button>
    {/if}
</section>
