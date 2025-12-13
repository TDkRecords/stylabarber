<!-- File: src/routes/contacto/+page.svelte -->
<script>
    let nombre = "";
    let telefono = "";
    let mensaje = "";

    function enviarFormulario() {
        alert(
            "Formulario enviado (ejemplo). Luego puedes conectarlo a un backend, WhatsApp o email.",
        );
    }
</script>

<section class="w-full min-h-screen bg-gray-50 pb-20">
    <!-- Hero -->
    <div
        class="relative w-full h-[70vh] bg-gray-300 flex items-center justify-center"
    >
        <div class="absolute inset-0 bg-black/40"></div>
        <h1
            class="relative text-white text-5xl font-bold text-center drop-shadow-md"
        >
            Contáctanos
        </h1>
    </div>

    <!-- Información + Formulario -->
    <div
        class="max-w-5xl mx-auto mt-16 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12"
    >
        <!-- Información de contacto -->
        <div class="space-y-6">
            <h2 class="text-3xl font-semibold mb-4">Información</h2>

            <p class="text-gray-700 flex items-center gap-3">
                <i class="fa-solid fa-location-dot text-xl"></i>
                Pasto, Nariño — Barrio Tamasagra MZ 54 Casa 1
            </p>

            <p class="text-gray-700 flex items-center gap-3">
                <i class="fa-solid fa-phone text-xl"></i>
                302 370 8756
            </p>

            <p class="text-gray-700 flex items-center gap-3">
                <i class="fa-brands fa-instagram text-xl"></i>
                @staylabarbershop
            </p>

            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
        </div>

        <!-- Formulario -->
        <form
            class="bg-white rounded-2xl shadow-md p-8 space-y-6"
            on:submit|preventDefault={enviarFormulario}
        >
            <h2 class="text-2xl font-semibold mb-2">Envíanos un mensaje</h2>

            <div class="flex flex-col gap-1">
                <label class="font-medium" for="nombre">Nombre</label>
                <input
                    type="text"
                    bind:value={nombre}
                    class="border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-black/20"
                    required
                />
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-medium" for="telefono">Teléfono</label>
                <input
                    type="text"
                    bind:value={telefono}
                    class="border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-black/20"
                    required
                />
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-medium" for="mensaje">Mensaje</label>
                <textarea
                    bind:value={mensaje}
                    rows="4"
                    class="border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-black/20"
                    required
                ></textarea>
            </div>

            <button
                class="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
            >
                Enviar
            </button>
        </form>
    </div>
</section>
