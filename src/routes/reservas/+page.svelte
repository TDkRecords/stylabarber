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
        signInWithRedirect,
        getRedirectResult,
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

    const provider = new GoogleAuthProvider();
    // Forzar selección de cuenta cada vez
    provider.setCustomParameters({
        prompt: "select_account",
    });

    // IMPORTANTE: Días en orden correcto (0 = Domingo)
    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // ------------------ AUTH ------------------
    onMount(async () => {
        // Verificar si hay resultado de redirect
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                console.log("Usuario autenticado desde redirect:", result.user);
            }
        } catch (error) {
            console.error("Error en redirect:", error);
            error = `Error de autenticación: ${error.message}`;
        }

        // Escuchar cambios de autenticación
        return onAuthStateChanged(auth, async (userAuth) => {
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
                    showProfileForm = true;
                    profileNombre = userAuth.displayName || "";
                    profileTelefono = "";
                } else {
                    profileNombre = profile.nombre;
                    profileTelefono = profile.telefono;
                    showProfileForm = false;
                    await loadData();
                    await loadMisReservas();
                }
            } catch (err) {
                console.error("Error cargando perfil:", err);
                error = "Error al cargar el perfil del usuario";
            } finally {
                loading = false;
            }
        });
    });

    async function loginWithGoogle() {
        try {
            error = null;
            loading = true;

            // Configuración mejorada del proveedor
            const googleProvider = new GoogleAuthProvider();
            googleProvider.setCustomParameters({
                prompt: "select_account",
                login_hint: "",
            });
            googleProvider.addScope("profile");
            googleProvider.addScope("email");

            // Detectar si estamos en móvil o si el ancho de la pantalla es pequeño
            const isMobile = /iPhone|iPad|iPod|Android/i.test(
                navigator.userAgent,
            );
            const isSmallScreen = window.innerWidth <= 768; // 768px o menos se considera móvil

            // Usar redirect en móviles o pantallas pequeñas
            if (isMobile || isSmallScreen) {
                try {
                    // Primero intentamos con redirect
                    await signInWithRedirect(auth, googleProvider);
                    // Si llegamos aquí, el redirect se inició correctamente
                    return;
                } catch (redirectError) {
                    console.warn(
                        "Redirect falló, intentando con popup:",
                        redirectError,
                    );
                    // Si falla el redirect, intentamos con popup
                    try {
                        await signInWithPopup(auth, googleProvider);
                    } catch (popupError) {
                        console.error("Error en popup:", popupError);
                        throw popupError; // Relanzar para que lo maneje el catch externo
                    }
                }
            } else {
                // En desktop, usar popup con manejo de errores mejorado
                try {
                    await signInWithPopup(auth, googleProvider);
                } catch (popupError) {
                    console.warn(
                        "Popup falló, intentando con redirect:",
                        popupError,
                    );
                    // Si falla el popup, intentamos con redirect
                    try {
                        await signInWithRedirect(auth, googleProvider);
                    } catch (redirectError) {
                        console.error("Error en redirect:", redirectError);
                        throw redirectError; // Relanzar para que lo maneje el catch externo
                    }
                }
            }
        } catch (err) {
            console.error("Error en login:", err);

            // Mensajes de error más descriptivos
            if (err.code === "auth/popup-blocked") {
                error =
                    "El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio o intenta en un navegador diferente.";
            } else if (err.code === "auth/popup-closed-by-user") {
                // No mostrar error si el usuario cierra el popup manualmente
                console.log("Usuario cerró la ventana de inicio de sesión");
            } else if (err.code === "auth/unauthorized-domain") {
                error =
                    "Error de configuración. Por favor, contacta al administrador del sitio.";
            } else if (err.code === "auth/network-request-failed") {
                error =
                    "Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.";
            } else if (
                err.code === "auth/account-exists-with-different-credential"
            ) {
                error =
                    "Ya existe una cuenta con el mismo correo pero con otro método de inicio de sesión. Por favor, inicia sesión con el método original.";
            } else {
                error = `Error al iniciar sesión: ${err.message || "Inténtalo de nuevo más tarde."}`;
            }
        } finally {
            loading = false;
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            // Limpiar estado
            profileNombre = "";
            profileTelefono = "";
            selectedService = null;
            selectedDate = "";
            selectedTime = "";
            misReservas = [];
        } catch (err) {
            console.error("Error en logout:", err);
            error = "Error al cerrar sesión";
        }
    }

    // ------------------ PERFIL ------------------
    async function handleProfileSubmit() {
        if (!profileNombre || !profileTelefono) {
            error = "Nombre y teléfono obligatorios";
            return;
        }

        try {
            await addCliente({
                uid: user.uid,
                nombre: profileNombre,
                telefono: profileTelefono,
                email: user.email,
                photoURL: user.photoURL,
            });

            showProfileForm = false;
            await loadData();
            await loadMisReservas();
        } catch (err) {
            console.error("Error guardando perfil:", err);
            error = "Error al guardar el perfil";
        }
    }

    // ------------------ DATA ------------------
    async function loadData() {
        try {
            [horarios, servicios, citasExistentes] = await Promise.all([
                getHorarios(),
                getServicios(),
                getCitas(),
            ]);
        } catch (err) {
            console.error("Error cargando datos:", err);
            error = "Error al cargar los datos";
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

            // Asegurarse de que las fechas estén en el formato correcto
            misReservas = reservas.map((reserva) => ({
                ...reserva,
                fecha: reserva.fecha?.split("T")[0] || reserva.fecha,
            }));

            console.log("Reservas cargadas correctamente:", misReservas);
        } catch (err) {
            console.error("Error cargando mis reservas:", err);
            misReservas = [];
            error =
                "Error al cargar el historial de reservas. Intenta recargar la página.";
        }
    }

    // ------------------ HORARIOS ------------------
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

    // Reactivo: cuando cambia servicio o fecha
    $: if (selectedService || selectedDate) {
        selectedTime = "";
        updateAvailableTimes();
    }

    // ------------------ RESERVA ------------------
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

            // Recargar datos
            await loadData();
            await loadMisReservas();

            // Scroll al historial
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
            <LoginCard onLogin={loginWithGoogle} {error} />
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
                <!-- 1. PERFIL DEL USUARIO -->
                <ProfileCard
                    {user}
                    profile={{
                        nombre: profileNombre,
                        telefono: profileTelefono,
                    }}
                    onLogout={logout}
                />

                <!-- MENSAJES DE ALERTA -->
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

                <!-- 2. FORMULARIO DE NUEVA RESERVA -->
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

                <!-- 3. HISTORIAL DE RESERVAS -->
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
