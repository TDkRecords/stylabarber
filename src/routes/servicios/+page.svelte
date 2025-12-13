<!-- File: src/routes/servicios/+page.svelte -->
<script>
    // Aquí puedes cargar los servicios dinámicamente si deseas luego
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
            Nuestros Servicios
        </h1>
    </div>

    <!-- Lista de servicios -->
    <div class="max-w-5xl mx-auto mt-14 px-6">
        <h2 class="text-3xl font-semibold mb-8 text-center">
            Servicios Disponibles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Servicio 1 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>

            <!-- Servicio 2 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>

            <!-- Servicio 3 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>

            <!-- Servicio 4 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>

            <!-- Servicio 5 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>

            <!-- Servicio 6 -->
            <div
                class="relative rounded-2xl overflow-hidden shadow-md h-[260px] bg-gray-200"
            >
                <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image:url('/placeholder.jpg')"
                ></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute bottom-0 left-0 p-4 text-white">
                    <h3 class="text-xl font-semibold mb-1">Lorem ipsum</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Nuestro Equipo -->
    <div class="max-w-5xl mx-auto mt-24 px-6">
        <h2 class="text-3xl font-semibold text-center mb-10">Nuestro Equipo</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <!-- Barber 1 -->
            <div
                class="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
                <div
                    class="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"
                ></div>
                <h3 class="text-xl font-semibold">Juan Pérez</h3>
                <p class="text-gray-600 text-sm">
                    Especialista en fades y cortes modernos.
                </p>
            </div>

            <!-- Barber 2 -->
            <div
                class="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
                <div
                    class="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"
                ></div>
                <h3 class="text-xl font-semibold">Carlos Díaz</h3>
                <p class="text-gray-600 text-sm">
                    Experto en barba y estilo clásico.
                </p>
            </div>

            <!-- Barber 3 -->
            <div
                class="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
                <div
                    class="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"
                ></div>
                <h3 class="text-xl font-semibold">Andrés Gómez</h3>
                <p class="text-gray-600 text-sm">
                    Maestro en tintura y diseños creativos.
                </p>
            </div>
        </div>
    </div>
</section>
