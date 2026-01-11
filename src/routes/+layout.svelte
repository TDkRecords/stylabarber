<script>
	import "./layout.css";
	import "@fortawesome/fontawesome-free/css/all.min.css";
	import favicon from "$lib/assets/favicon.svg";

	let open = false;
	export let children; // Svelte way de recibir children en layout
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- NAV fijo con altura conocida -->
<nav
	class="fixed top-0 left-0 w-full h-16 bg-white shadow-md px-6 flex items-center justify-between z-50"
>
	<a href="/" class="text-xl font-bold">Stayla</a>

	<button class="sm:hidden" on:click={() => (open = !open)} aria-label="Menu">
		<i class="fa-solid fa-bars text-2xl"></i>
	</button>

	<div class="hidden sm:flex gap-6">
		<a href="/" class="hover:text-gray-600">Inicio</a>
		<a href="/reservas" class="hover:text-gray-600">Reservas</a>
		<a href="/galeria" class="hover:text-gray-600">Galería</a>
		<a href="/contacto" class="hover:text-gray-600">Contacto</a>
	</div>
</nav>

<!-- MENÚ MÓVIL: fixed overlay justo debajo del nav (no empuja contenido) -->
{#if open}
	<div
		class="fixed top-16 left-0 w-full bg-white border-t z-40 sm:hidden px-6 py-4"
	>
		<a href="/" class="block py-2">Inicio</a>
		<a href="/reservas" class="block py-2">Reservas</a>
		<a href="/galeria" class="block py-2">Galería</a>
		<a href="/contacto" class="block py-2">Contacto</a>
	</div>
{/if}

<!-- Compensa la altura del nav para que el contenido no quede debajo -->
<div class="pt-16">
	{@render children()}
</div>

<!-- File: src/lib/components/Footer.svelte -->
<footer class="w-full bg-black text-gray-300 py-12 mt-20">
	<div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
		<!-- Logo + Descripción -->
		<div>
			<h2 class="text-2xl font-bold text-white mb-3">Stayla Barbería</h2>
			<p class="text-sm leading-relaxed">
				Estilo, precisión y calidad. Tu look en manos de profesionales
				dedicados a tu imagen.
			</p>
		</div>

		<!-- NUEVA Navegación -->
		<div>
			<h3 class="text-xl font-semibold text-white mb-3">Explorar</h3>
			<ul class="space-y-2">
				<li>
					<a href="/" class="hover:text-white flex items-center">
						<i class="fas fa-home mr-2"></i> Inicio
					</a>
				</li>

				<li>
					<a
						href="/servicios"
						class="hover:text-white flex items-center"
					>
						<i class="fas fa-cut mr-2"></i> Servicios
					</a>
				</li>

				<li>
					<a
						href="/galeria"
						class="hover:text-white flex items-center"
					>
						<i class="fas fa-images mr-2"></i> Galería
					</a>
				</li>

				<li>
					<a
						href="/reservas"
						class="hover:text-white flex items-center"
					>
						<i class="fas fa-calendar-check mr-2"></i> Reservas
					</a>
				</li>

				<li>
					<a
						href="/contacto"
						class="hover:text-white flex items-center"
					>
						<i class="fas fa-envelope-open mr-2"></i> Contacto
					</a>
				</li>
			</ul>
		</div>

		<!-- Información de contacto -->
		<div>
			<h3 class="text-xl font-semibold text-white mb-3">Contáctanos</h3>
			<ul class="space-y-2 text-sm">
				<li>
					<i class="fas fa-map-marker-alt mr-2"></i> Calle 123, Bogotá,
					Colombia
				</li>
				<li><i class="fas fa-phone mr-2"></i> +57 300 000 0000</li>
				<li>
					<i class="fas fa-envelope mr-2"></i> contacto@stayla.com
				</li>
			</ul>

			<!-- Redes sociales -->
			<div class="flex space-x-4 mt-4 text-xl">
				<a href="/" class="hover:text-white">
					<!-- Facebook -->
					<i class="fab fa-facebook"></i></a
				>
				<a href="/" class="hover:text-white">
					<!-- Instagram -->
					<i class="fab fa-instagram"></i></a
				>
				<a href="/" class="hover:text-white">
					<!-- WhatsApp -->
					<i class="fab fa-whatsapp"></i></a
				>
			</div>
		</div>
	</div>

	<div
		class="border-t border-white/10 mt-10 pt-5 text-center text-sm text-gray-500"
	>
		© {new Date().getFullYear()} Stayla Barbería — Todos los derechos reservados.
	</div>
</footer>
