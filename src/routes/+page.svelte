<script lang="ts">
    import { date } from "$lib/date";
    import Myname from './component.svelte'
    if(!localStorage.getItem('thoughts')){
        localStorage.setItem('thoughts','{}') 
    }
    let thoughts = JSON.parse(localStorage.getItem('thoughts'))


    let thought : Number = $state()

    function initializeThouht(event: MouseEvent){
        thoughts = JSON.parse(localStorage.getItem('thoughts'))
        thoughts[thought] = {count: 0, records:{}}
        localStorage.setItem('thoughts',JSON.stringify(thoughts))
        console.log(JSON.parse(localStorage.getItem('thoughts')))
        location.reload()

    }

    function increment(key){
        console.log(key)
        console.log(thoughts[key].count)
        thoughts[key].count += 1
        let dt = date()
        if (!thoughts[key].records) {
            thoughts[key].records = {}; // Ensure records object is initialized
        }
        if (!thoughts[key].records[dt]) {
            thoughts[key].records[dt] = {};
        }

        if (!thoughts[key].records[dt].record) {
            thoughts[key].records[dt].record = [];
        }

        if (!thoughts[key].records[dt].count) {
            thoughts[key].records[dt].count = 0;
        }
        thoughts[key].records[dt].count += 1
        thoughts[key].records[dt].record.push(Date()) 
        console.log(thoughts[key].count)
        localStorage.setItem('thoughts', JSON.stringify(thoughts))
        location.reload()
    }

    function decrement(key){
        console.log(key)
        if (thoughts[key].count > 0) {
            thoughts[key].count += -1
        }
        
        let dt = date()
        if (!thoughts[key].records) {
            thoughts[key].records = {}; // Ensure records object is initialized
        }
        if (!thoughts[key].records[dt]) {
            thoughts[key].records[dt] = {};
        }

        if (!thoughts[key].records[dt].record) {
            thoughts[key].records[dt].record = [];
        }

        if (!thoughts[key].records[dt].count) {
            thoughts[key].records[dt].count = 0;
        }

        if(thoughts[key].records[dt].count > 0){
            thoughts[key].records[dt].count += -1
            thoughts[key].records[dt].record.pop() 
        }
        
        
        console.log(thoughts[key].count)
        localStorage.setItem('thoughts', JSON.stringify(thoughts))
        location.reload()
    }

    function reset() {
        let keys = document.getElementsByClassName('key');
        keys = Array.from(keys); // Convert to array
        keys.forEach(key => {
        console.log(key.innerText);
        thoughts[key.innerText].count = 0
        localStorage.setItem('thoughts', JSON.stringify(thoughts))
        location.reload()
        });
    }
    

    console.log(date())
</script>

<input type="text" name="thought" bind:value={thought}>
<button type="button" onclick={initializeThouht}>create thought</button>

{#each Object.entries(thoughts) as [key, value]}
    <h1 class="key">{key}</h1>
    <button onclick={()=>{decrement(key)}}>-</button>
    <input type="number" min="0" value={value.count}>
    <button onclick={()=>{increment(key)}}>+</button>
{/each}

<button onclick={()=>{reset()}}>reset</button>
