<!-- File: src/routes/+page.svelte -->
<script>
    // Aquí irían datos dinámicos si los necesitas luego
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
            Stayla Barbershop
        </h1>
    </div>

    <!-- Info principal -->
    <div class="max-w-4xl mx-auto mt-10 px-6 text-center">
        <h2 class="text-3xl font-semibold mb-4">Lorem ipsum dolor sit.</h2>
        <p class="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Vivamus vel varius erat. Nulla id dapibus nunc.
            Suspendisse potenti. Curabitur placerat dui at mauris cursus, sed
            pretium sapien tempor.
        </p>
    </div>

    <!-- Botones principales -->
    <div
        class="max-w-3xl mx-auto mt-8 px-6 flex flex-col sm:flex-row justify-center gap-4"
    >
        <a
            href="/reservas"
            class="bg-black text-white text-center py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition"
        >
            Reservar ahora
        </a>
        <a
            href="https://instagram.com/staylabarbershop"
            target="_blank"
            class="border border-black text-black text-center py-3 px-6 rounded-xl font-medium hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
        >
            <i class="fa-brands fa-instagram"></i> Instagram
        </a>
    </div>

    <!-- Mapa + dirección -->
    <div
        class="max-w-5xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 px-6"
    >
        <div class="space-y-4">
            <h3 class="text-2xl font-semibold">Ubicación</h3>
            <p class="text-gray-700">
                Estamos en Pasto, Nariño — Barrio Tamasagra MZ 54 Casa 1
            </p>
            <p class="text-gray-700 flex items-center gap-2">
                <i class="fa-solid fa-phone"></i> 302 370 8756
            </p>
            <p class="text-gray-700 flex items-center gap-2">
                <i class="fa-brands fa-instagram"></i> @staylabarbershop
            </p>
        </div>

        <div class="w-full h-72 rounded-xl overflow-hidden bg-gray-300">
            <!-- Reemplaza cuando tengas el mapa real -->
        </div>
    </div>

    <!-- Galería preview -->
    <div class="max-w-5xl mx-auto mt-20 px-6">
        <h3 class="text-3xl font-semibold mb-6 text-center">Nuestros cortes</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-64 bg-gray-300 rounded-xl"></div>
        </div>
        <div class="mt-6 text-center">
            <a href="/galeria" class="underline font-medium">Ver más</a>
        </div>
    </div>
</section>
