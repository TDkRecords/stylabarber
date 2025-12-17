<script>
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import LoginCard from "./components/LoginCard.svelte";
    import ProfileForm from "./components/ProfileForm.svelte";
    import ReservaHeader from "./components/ReservaHeader.svelte";
    import AlertMessage from "./components/AlertMessage.svelte";
    import ReservaForm from "./components/ReservaForm.svelte";

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
    import { getCitas } from "../admin/citas/js/getReservation";
    import { addCita } from "../admin/citas/js/addReservation";

    const provider = new GoogleAuthProvider();

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
    onMount(() => {
        return onAuthStateChanged(auth, async (userAuth) => {
            loading = true;
            user = userAuth;

            if (!userAuth) {
                showProfileForm = false;
                loading = false;
                return;
            }

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
            }

            loading = false;
        });
    });

    async function loginWithGoogle() {
        await signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

    // ------------------ PERFIL ------------------
    async function handleProfileSubmit() {
        if (!profileNombre || !profileTelefono) {
            error = "Nombre y teléfono obligatorios";
            return;
        }

        await addCliente({
            uid: user.uid,
            nombre: profileNombre,
            telefono: profileTelefono,
            email: user.email,
            photoURL: user.photoURL,
        });

        showProfileForm = false;
        await loadData();
    }

    // ------------------ DATA ------------------
    async function loadData() {
        [horarios, servicios, citasExistentes] = await Promise.all([
            getHorarios(),
            getServicios(),
            getCitas(),
        ]);

        console.log("Horarios cargados:", horarios);
        console.log("Servicios cargados:", servicios);
        console.log("Citas existentes:", citasExistentes);
    }

    // ------------------ HORARIOS ------------------
    function getHorarioForDate(date) {
        if (!date) return null;

        // Crear fecha en zona horaria local para evitar desfases
        const [year, month, day] = date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        const dayIndex = localDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.

        console.log("Fecha seleccionada:", date);
        console.log(
            "Día de la semana (índice):",
            dayIndex,
            "=",
            diasSemana[dayIndex],
        );

        const horario = horarios.find((h) => h.dia === diasSemana[dayIndex]);
        console.log("Horario encontrado:", horario);

        return horario;
    }

    function generateTimeSlots(inicio, fin, duracion) {
        let slots = [];
        let start = toMinutes(inicio);
        const end = toMinutes(fin);

        console.log(
            `Generando slots: ${inicio} (${start}min) a ${fin} (${end}min), duración: ${duracion}min`,
        );

        while (start + duracion <= end) {
            slots.push(fromMinutes(start));
            start += duracion;
        }

        console.log("Slots generados:", slots);
        return slots;
    }

    function isTimeSlotAvailable(date, time, duracion) {
        const available = !citasExistentes.some((c) => {
            if (c.fecha !== date) return false;
            const start = toMinutes(c.hora);
            const end = start + c.duracion;
            const current = toMinutes(time);
            return current < end && current + duracion > start;
        });

        return available;
    }

    function updateAvailableTimes() {
        availableTimes = [];
        if (!selectedDate || !selectedService) {
            console.log("Falta fecha o servicio");
            return;
        }

        const horario = getHorarioForDate(selectedDate);

        if (!horario) {
            console.log("No hay horario definido para este día");
            return;
        }

        if (horario.cerrado) {
            console.log("El día está cerrado");
            return;
        }

        console.log("Generando horarios disponibles...");
        const allSlots = generateTimeSlots(
            horario.horaApertura,
            horario.horaCierre,
            selectedService.duracion,
        );

        availableTimes = allSlots.filter((t) =>
            isTimeSlotAvailable(selectedDate, t, selectedService.duracion),
        );

        console.log("Horarios disponibles:", availableTimes);
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

            // Recargar citas para actualizar disponibilidad
            await loadData();
        } catch (err) {
            console.error("Error al crear reserva:", err);
            error = "Error al crear la reserva. Por favor intenta nuevamente.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="w-full min-h-screen bg-gray-50 py-8 px-6">
    <div class="max-w-4xl mx-auto">
        {#if loading}
            <LoadingSpinner />
        {:else if !user}
            <LoginCard onLogin={loginWithGoogle} />
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
                <ReservaHeader
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
                        message="¡Reserva creada exitosamente!"
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
            </div>
        {/if}
    </div>
</section>
