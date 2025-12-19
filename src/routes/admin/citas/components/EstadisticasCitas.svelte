<script>
    export let estadisticas;

    const cards = [
        {
            label: "Total",
            value: () => estadisticas.total,
            icon: "fa-calendar",
            color: "bg-gray-100 text-gray-800",
        },
        {
            label: "Pendientes",
            value: () => estadisticas.pendientes,
            icon: "fa-clock",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            label: "Confirmadas",
            value: () => estadisticas.confirmadas,
            icon: "fa-check-circle",
            color: "bg-blue-100 text-blue-800",
        },
        {
            label: "Completadas",
            value: () => estadisticas.completadas,
            icon: "fa-check-double",
            color: "bg-green-100 text-green-800",
        },
        {
            label: "Canceladas",
            value: () => estadisticas.canceladas,
            icon: "fa-times-circle",
            color: "bg-red-100 text-red-800",
        },
        {
            label: "Asistieron",
            value: () => estadisticas.asistieron,
            icon: "fa-user-check",
            color: "bg-emerald-100 text-emerald-800",
        },
        {
            label: "No Asistieron",
            value: () => estadisticas.noAsistieron,
            icon: "fa-user-times",
            color: "bg-rose-100 text-rose-800",
        },
    ];
</script>

<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
    {#each cards as card}
        <div
            class="bg-white rounded-xl shadow-md p-4 border-2 border-gray-100
                   hover:shadow-lg transition-all"
        >
            <div class="flex items-center justify-between mb-2">
                <div
                    class="w-10 h-10 {card.color} rounded-lg flex items-center justify-center"
                >
                    <i class="fas {card.icon} text-lg"></i>
                </div>
            </div>
            <div class="text-2xl font-bold text-gray-900">{card.value()}</div>
            <div class="text-xs text-gray-600 mt-1">{card.label}</div>
        </div>
    {/each}
</div>
