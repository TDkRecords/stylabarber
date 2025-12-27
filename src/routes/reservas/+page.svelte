<script>
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import LoginCard from "./components/LoginCard.svelte";
    import ProfileForm from "./components/ProfileForm.svelte";
    import ProfileCard from "./components/ProfileCard.svelte";
    import AlertMessage from "./components/AlertMessage.svelte";
    import ReservaForm from "./components/ReservaForm.svelte";
    import HistorialReservas from "./components/HistorialReservas.svelte";

    // PERFIL
    let profileNombre = "";
    let profileTelefono = "";

    // RESERVA
    let selectedService = null;
    let selectedDate = "";
    let selectedTime = "";
    let availableTimes = [];

    // ESTADO GENERAL
    let loading = true;
    let user = null;
    let error = null;
    let success = false;
    let showProfileForm = false;
    let isSubmitting = false;

    // DATA
    let servicios = [];
    let horarios = [];
    let citasExistentes = [];
    let misReservas = [];

    import { onMount } from "svelte";
    import { auth } from "$lib/js/firebase";
    import {
        GoogleAuthProvider,
        signInWithPopup,
        onAuthStateChanged,
        signOut,
    } from "firebase/auth";

    import {
        getClienteByUid,
        addCliente,
    } from "../admin/clientes/js/clienteProfile";

    import { getHorarios } from "../admin/horarios/js/getHorarios";
    import { getServicios } from "../admin/servicios/js/getServicios";
    import {
        getCitas,
        getCitasCliente,
    } from "../admin/citas/js/getReservation";
    import { addCita } from "../admin/citas/js/addReservation";

    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // ============================================
    // AUTH - CONFIGURACIÓN MEJORADA
    // ============================================
    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            console.log("👤 Estado de auth:", userAuth?.email || "sin usuario");

            loading = true;
            user = userAuth;

            if (!userAuth) {
                showProfileForm = false;
                loading = false;
                return;
            }

            try {
                const profile = await getClienteByUid(userAuth.uid);

                if (!profile) {
                    console.log("📝 Usuario nuevo, mostrar formulario");
                    showProfileForm = true;
                    profileNombre = userAuth.displayName || "";
                    profileTelefono = "";
                } else {
                    console.log("✅ Perfil encontrado:", profile.nombre);
                    profileNombre = profile.nombre;
                    profileTelefono = profile.telefono;
                    showProfileForm = false;
                    await loadData();
                    await loadMisReservas();
                }
            } catch (err) {
                console.error("❌ Error cargando perfil:", err);
                error = "Error al cargar el perfil del usuario";
            } finally {
                loading = false;
            }
        });

        return () => unsubscribe();
    });

    async function loginWithGoogle() {
        error = null;
        loading = true;

        try {
            console.log("🔐 Iniciando login con Google (POPUP)...");

            const provider = new GoogleAuthProvider();

            // Configuración adicional del provider
            provider.setCustomParameters({
                prompt: "select_account", // Fuerza la selección de cuenta
            });

            // Opcional: solicitar scopes adicionales si los necesitas
            // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
            // provider.addScope('https://www.googleapis.com/auth/userinfo.email');

            const result = await signInWithPopup(auth, provider);

            console.log("✅ Login exitoso:", result.user.email);

            // El usuario se maneja automáticamente por onAuthStateChanged
        } catch (err) {
            console.error("❌ Error en login:", err);

            // Manejar errores específicos de Firebase Auth
            switch (err.code) {
                case "auth/popup-closed-by-user":
                    console.log("ℹ️ Usuario cerró el popup");
                    // No mostrar error si el usuario cerró el popup intencionalmente
                    error = null;
                    break;

                case "auth/cancelled-popup-request":
                    console.log(
                        "ℹ️ Popup cancelado (otro popup ya estaba abierto)",
                    );
                    error = null;
                    break;

                case "auth/popup-blocked":
                    error =
                        "⚠️ El navegador bloqueó el popup. Por favor:\n1. Permite ventanas emergentes para este sitio\n2. Verifica que no tengas bloqueadores de popups activos\n3. Intenta de nuevo";
                    break;

                case "auth/unauthorized-domain":
                    error =
                        "⚠️ Error de configuración del dominio.\n\nPara resolver:\n1. Ve a Firebase Console\n2. Authentication → Settings → Authorized domains\n3. Agrega el dominio actual a la lista";
                    break;

                case "auth/operation-not-allowed":
                    error =
                        "⚠️ El método de inicio de sesión con Google no está habilitado.\n\nPara resolver:\n1. Ve a Firebase Console\n2. Authentication → Sign-in method\n3. Habilita Google como proveedor";
                    break;

                case "auth/network-request-failed":
                    error =
                        "⚠️ Error de conexión. Verifica tu conexión a internet y vuelve a intentar.";
                    break;

                case "auth/too-many-requests":
                    error =
                        "⚠️ Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.";
                    break;

                case "auth/user-disabled":
                    error =
                        "Esta cuenta ha sido deshabilitada. Contacta con el administrador.";
                    break;

                default:
                    // Error genérico
                    error = `Error al iniciar sesión: ${err.message || "Intenta de nuevo"}`;
                    console.error("Error completo:", err);
            }
        } finally {
            loading = false;
        }
    }

    async function logout() {
        try {
            console.log("👋 Cerrando sesión...");
            await signOut(auth);

            // Limpiar estado local
            profileNombre = "";
            profileTelefono = "";
            selectedService = null;
            selectedDate = "";
            selectedTime = "";
            misReservas = [];
            error = null;
            success = false;

            console.log("✅ Sesión cerrada exitosamente");
        } catch (err) {
            console.error("❌ Error en logout:", err);
            error = "Error al cerrar sesión. Por favor recarga la página.";
        }
    }

    // ============================================
    // PERFIL
    // ============================================
    async function handleProfileSubmit() {
        if (!profileNombre.trim()) {
            error = "El nombre es obligatorio";
            return;
        }

        if (!profileTelefono.trim()) {
            error = "El teléfono es obligatorio";
            return;
        }

        // Validar formato de teléfono colombiano (10 dígitos)
        const telefonoLimpio = profileTelefono.replace(/\s/g, "");
        if (!/^\d{10}$/.test(telefonoLimpio)) {
            error = "El teléfono debe tener 10 dígitos";
            return;
        }

        try {
            await addCliente({
                uid: user.uid,
                nombre: profileNombre.trim(),
                telefono: telefonoLimpio,
                email: user.email,
                photoURL: user.photoURL || "",
            });

            showProfileForm = false;
            error = null;

            await loadData();
            await loadMisReservas();
        } catch (err) {
            console.error("Error guardando perfil:", err);
            error = "Error al guardar el perfil. Por favor intenta nuevamente.";
        }
    }

    // ============================================
    // CARGA DE DATOS
    // ============================================
    async function loadData() {
        try {
            [horarios, servicios, citasExistentes] = await Promise.all([
                getHorarios(),
                getServicios(),
                getCitas(),
            ]);
        } catch (err) {
            console.error("Error cargando datos:", err);
            error = "Error al cargar los datos. Por favor recarga la página.";
        }
    }

    async function loadMisReservas() {
        try {
            if (!user || !user.uid) {
                console.log("No hay usuario autenticado");
                misReservas = [];
                return;
            }

            console.log("Cargando reservas para el usuario:", user.uid);
            const reservas = await getCitasCliente(user.uid);

            if (!Array.isArray(reservas)) {
                console.error("Las reservas no son un array:", reservas);
                misReservas = [];
                return;
            }

            misReservas = reservas.map((reserva) => ({
                ...reserva,
                fecha: reserva.fecha?.split("T")[0] || reserva.fecha,
            }));

            console.log("Reservas cargadas correctamente:", misReservas);
        } catch (err) {
            console.error("Error cargando mis reservas:", err);
            misReservas = [];
            // No mostrar error aquí para no interferir con la experiencia del usuario
        }
    }

    // ============================================
    // LÓGICA DE RESERVAS
    // ============================================
    function getHorarioForDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        const dayIndex = localDate.getDay();

        return horarios.find((h) => h.dia === diasSemana[dayIndex]);
    }

    function generateTimeSlots(inicio, fin, duracion) {
        let slots = [];
        let start = toMinutes(inicio);
        const end = toMinutes(fin);

        while (start + duracion <= end) {
            slots.push(fromMinutes(start));
            start += duracion;
        }

        return slots;
    }

    function isTimeSlotAvailable(date, time, duracion) {
        return !citasExistentes.some((c) => {
            if (c.fecha !== date) return false;
            const start = toMinutes(c.hora);
            const end = start + c.duracion;
            const current = toMinutes(time);
            return current < end && current + duracion > start;
        });
    }

    function updateAvailableTimes() {
        availableTimes = [];
        if (!selectedDate || !selectedService) return;

        const horario = getHorarioForDate(selectedDate);

        if (!horario || horario.cerrado) return;

        const allSlots = generateTimeSlots(
            horario.horaApertura,
            horario.horaCierre,
            selectedService.duracion,
        );

        availableTimes = allSlots.filter((t) =>
            isTimeSlotAvailable(selectedDate, t, selectedService.duracion),
        );
    }

    function toMinutes(h) {
        const [hh, mm] = h.split(":").map(Number);
        return hh * 60 + mm;
    }

    function fromMinutes(m) {
        return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    }

    $: if (selectedService || selectedDate) {
        selectedTime = "";
        updateAvailableTimes();
    }

    async function handleSubmit() {
        try {
            isSubmitting = true;
            error = null;

            await addCita({
                clienteId: user.uid,
                clienteNombre: profileNombre,
                clienteTelefono: profileTelefono,
                clienteEmail: user.email,
                clienteFoto: user.photoURL || "",
                servicioId: selectedService.id,
                servicioNombre: selectedService.nombre,
                duracion: selectedService.duracion,
                precio: selectedService.precio,
                fecha: selectedDate,
                hora: selectedTime,
                estado: "pendiente",
            });

            success = true;
            selectedService = null;
            selectedDate = "";
            selectedTime = "";
            availableTimes = [];

            await loadData();
            await loadMisReservas();

            setTimeout(() => {
                document.getElementById("historial-reservas")?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        } catch (err) {
            console.error("Error al crear reserva:", err);
            error = "Error al crear la reserva. Por favor intenta nuevamente.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto">
        {#if loading}
            <LoadingSpinner />
        {:else if !user}
            <LoginCard on:login={loginWithGoogle} {error} />
        {:else if showProfileForm}
            <ProfileForm
                {user}
                bind:nombre={profileNombre}
                bind:telefono={profileTelefono}
                {error}
                onSubmit={handleProfileSubmit}
            />
        {:else}
            <div class="space-y-6">
                <ProfileCard
                    {user}
                    profile={{
                        nombre: profileNombre,
                        telefono: profileTelefono,
                    }}
                    onLogout={logout}
                />

                {#if error}
                    <AlertMessage
                        type="error"
                        message={error}
                        onClose={() => (error = null)}
                    />
                {/if}

                {#if success}
                    <AlertMessage
                        type="success"
                        message="¡Reserva creada exitosamente! Revisa tu historial abajo."
                        onClose={() => (success = false)}
                    />
                {/if}

                <ReservaForm
                    {servicios}
                    {horarios}
                    {citasExistentes}
                    bind:selectedService
                    bind:selectedDate
                    bind:selectedTime
                    bind:availableTimes
                    {isSubmitting}
                    onSubmit={handleSubmit}
                />

                <div id="historial-reservas">
                    <HistorialReservas
                        reservas={misReservas}
                        onReload={async () => {
                            await loadData();
                            await loadMisReservas();
                        }}
                    />
                </div>
            </div>
        {/if}
    </div>
</section>
