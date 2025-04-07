<script>
    // Create a custom scale animation
    function scale(node, params) {
        const { start = 1, end = 1.2, duration = 300 } = params;
        return {
            duration,
            css: (t) => `transform: scale(${start + (end - start) * t});`
        };
    }

    let array = [1,2,3,4,5,6,7,8,9,10];
    
    function shuffle() {
        array = array.sort(() => Math.random() - 0.5);
    }

    console.log(window)
</script>

<button on:click={shuffle}>Shuffle</button>

{#each array as item, index (item)}
    <div animate:scale={{duration: 10000}}>{index}</div>
{/each}