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

    // ------------------ AUTH CORREGIDO ------------------
    onMount(() => {
        let unsubscribe;

        const initAuth = async () => {
            try {
                // 1. Primero verificar si hay resultado de redirect
                console.log("Verificando resultado de redirect...");
                const result = await getRedirectResult(auth);

                if (result) {
                    console.log(
                        "✅ Usuario autenticado desde redirect:",
                        result.user.email,
                    );
                }
            } catch (redirectError) {
                console.error("❌ Error en getRedirectResult:", redirectError);

                // Errores específicos
                if (redirectError.code === "auth/unauthorized-domain") {
                    error =
                        "Dominio no autorizado. Verifica la configuración de Firebase.";
                } else if (
                    redirectError.code === "auth/operation-not-allowed"
                ) {
                    error =
                        "Método de autenticación no habilitado en Firebase.";
                } else if (redirectError.code === "auth/popup-blocked") {
                    error = "El popup fue bloqueado. Intenta de nuevo.";
                } else {
                    error = `Error de autenticación: ${redirectError.message}`;
                }
            }

            // 2. Escuchar cambios de autenticación
            unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
                console.log(
                    "🔄 Estado de autenticación cambió:",
                    userAuth?.email || "sin usuario",
                );
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
                        console.log(
                            "📝 Usuario sin perfil, mostrando formulario",
                        );
                        showProfileForm = true;
                        profileNombre = userAuth.displayName || "";
                        profileTelefono = "";
                    } else {
                        console.log("✅ Perfil cargado:", profile.nombre);
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
        };

        initAuth();

        // Cleanup
        return () => {
            if (unsubscribe) unsubscribe();
        };
    });

    async function loginWithGoogle() {
        error = null;
        loading = true;

        try {
            console.log("🔐 Iniciando login con Google...");

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: "select_account",
            });

            // Detectar si es móvil
            const isMobile = /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent,
            );
            console.log("📱 Es móvil:", isMobile);

            if (isMobile) {
                console.log("🔄 Usando signInWithRedirect para móvil");
                await signInWithRedirect(auth, provider);
                // NO establecer loading = false aquí, la página se recargará
            } else {
                console.log("🪟 Usando signInWithPopup para escritorio");
                const result = await signInWithPopup(auth, provider);
                console.log("✅ Login exitoso:", result.user.email);
                loading = false;
            }
        } catch (err) {
            console.error("❌ Error en login:", err);

            // Solo mostrar error si no es que el usuario cerró el popup
            if (err.code === "auth/popup-closed-by-user") {
                console.log("ℹ️ Usuario cerró el popup");
            } else if (err.code === "auth/cancelled-popup-request") {
                console.log("ℹ️ Popup cancelado");
            } else if (err.code === "auth/unauthorized-domain") {
                error =
                    "❌ Dominio no autorizado. Agrega tu dominio en Firebase Console → Authentication → Settings → Authorized domains";
            } else {
                error = `Error: ${err.message}`;
            }

            loading = false;
        }
    }

    async function logout() {
        try {
            console.log("👋 Cerrando sesión...");
            await signOut(auth);
            // Limpiar estado
            profileNombre = "";
            profileTelefono = "";
            selectedService = null;
            selectedDate = "";
            selectedTime = "";
            misReservas = [];
            console.log("✅ Sesión cerrada");
        } catch (err) {
            console.error("❌ Error en logout:", err);
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
            <LoginCard on:login={loginWithGoogle} />
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
