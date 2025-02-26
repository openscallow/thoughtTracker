<script lang="ts">
    import '@tailwind';
    import { EllipsisVertical } from 'lucide-svelte';

    let { index, lastUpdate, totalCount} = $props();
    
    function showProperties(index: number) {
        let properties = document.querySelector(`.thought${index}`) as HTMLElement;
        properties.classList.toggle("hidden");
    }
</script>

<div class='absolute top-0 right-0 flex flex-row-reverse'>
    <button class="border-none cursor-pointer bg-transparent" onclick={()=>showProperties(index)}><EllipsisVertical /></button>
    <div class="p-2 mt-1 bg-white hidden rounded-md thought{index}">
        <ul>
            <li class="list-none">last Update: {lastUpdate}</li>
            <li class="list-none">total count: {totalCount}</li>
        </ul>
    </div>
</div>