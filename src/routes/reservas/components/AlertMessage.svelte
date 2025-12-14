<script>
    export let type = "error"; // error | success
    export let message;
    export let onClose;
</script>

<div
    class="p-4 rounded-r-lg border-l-4 {type === 'error'
        ? 'bg-red-50 border-red-400'
        : 'bg-green-50 border-green-400'}"
>
    <div class="flex items-center">
        <p class="text-sm">{message}</p>
        <button on:click={onClose} class="ml-auto">
            <i class="fas fa-times"></i>
        </button>
    </div>
</div>
