<!-- File: src/routes/+page.svelte -->
<script>
    // Aquí irían datos dinámicos si los necesitas luego
</script>

<section class="w-full min-h-screen bg-gray-50 pb-20">
    <!-- Hero -->
    <div class="relative w-full h-[70vh] flex items-center justify-center">
        <img src="/styla.png" alt="" srcset="" />
    </div>

    <!-- Info principal -->
    <div class="max-w-4xl mx-auto mt-10 px-6 text-center">
        <h2 class="text-3xl font-semibold mb-4">
            Estilo y Tradición en Cada Corte
        </h2>
        <p class="text-gray-600 leading-relaxed">
            En Stayla Barbershop combinamos técnicas tradicionales con los
            estilos más modernos para ofrecerte un servicio de barbería de
            primera. Nuestros barberos certificados están dedicados a brindarte
            una experiencia única y personalizada que realce tu estilo personal.
            Ven y descubre por qué somos la mejor opción en Pasto para cuidar de
            tu imagen.
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
    <div class="max-w-5xl mx-auto mt-16 px-6 flex justify-center items-center">
        <div class="w-full lg:w-1/2">
            <h3 class="text-2xl font-semibold">Visítanos</h3>
            <p class="text-gray-700">
                Ubicados estratégicamente en el corazón de Pasto, Nariño —
                Barrio Tamasagra MZ 54 Casa 1. Un espacio diseñado para tu
                comodidad y relajación mientras cuidas de tu estilo.
            </p>
        </div>

        <div
            class="w-full lg:w-1/2 h-72 rounded-xl overflow-hidden bg-gray-300"
        >
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d997.2350119295014!2d-77.29217573052573!3d1.2022193407341943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMTInMDguMCJOIDc3wrAxNycyOS41Ilc!5e0!3m2!1ses-419!2sco!4v1768100115387!5m2!1ses-419!2sco"
                width="600"
                height="450"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Mapa de Styla Barbershop"
            ></iframe>
        </div>
    </div>

    <!-- Galería preview -->
    <div class="max-w-5xl mx-auto mt-20 px-6">
        <h3 class="text-3xl font-semibold mb-6 text-center">
            Transformaciones que Hablan por Sí Solas
        </h3>
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
