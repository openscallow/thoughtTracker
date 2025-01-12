<script>
    import { onMount } from 'svelte';
    
    let count = $state(0); // Reactive variable for input value4
    let precount = $derived.by(()=>{
        if(count > 0) return count - 1
    })
    let nextcount = $derived(count + 1)

    let change = $state(0); // Reactive variable for input value
    let deltaX =$state();
    let display;   // Reference to the input element
    let output;    // Reference to the output paragraph

    let startX = 0; // Initial cursor X position
    let isDragging = false; // State to track dragging

    onMount(() => {
        // Get references to DOM elements
        display = document.getElementById('counts');
        output = document.getElementById('output');

        console.log(display);

        // When the user clicks on the div
        display.addEventListener('mousedown', (event) => {
            startX = event.clientX; // Record the initial cursor X position
            isDragging = true;
            console.log('Mouse down:', event);
        });

        // Track mouse movement
        document.addEventListener('mousemove', (event) => {
            if (!isDragging) return; // Only track if dragging
            console.log('Mouse move:', event);
            const currentX = event.clientX; // Current cursor X position
            deltaX = currentX - startX; // Calculate movement
            if(deltaX > 0) {
                count++
            }else{
                if(count > 0) count--
            }

            // Update output to show movement and direction
            output.textContent = `Moved: ${deltaX}px (${deltaX > 0 ? 'Right' : 'Left'})`;
        });

        // Stop tracking when the user releases the mouse button
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                change = change + deltaX > 0 ? change + deltaX : 0;
                isDragging = false; // Stop dragging
                output.textContent += ' (Stopped)';
            }
        });
    });
</script>

<!-- HTML structure -->
<input type="number" id="precounts" value={precount}>
<input type="number" id="counts" bind:value={count}>
<input type="number" id="nextcounts" value={nextcount}>
<p id="output"></p>
<p>{change}</p>
