<script lang="ts">
    import { date } from "$lib/date";
    
    if(!localStorage.getItem('thoughts')){
        localStorage.setItem('thoughts','{}') 
    }
    let thoughts = JSON.parse(localStorage.getItem('thoughts'))


    let thought:string;

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

<div class="grid">
{#each Object.entries(thoughts) as [key, value]}
    <div>
        <h2 class="key">{key}</h2>
        <button onclick={()=>{decrement(key)}}>-</button>
        <span class="counter">{value.count}</span>
        <button onclick={()=>{increment(key)}}>+</button>
    </div>
{/each}
</div>

<button onclick={()=>{reset()}}>reset</button>

<style>
    .grid{
        display: grid;
        grid-row-gap: 4px;
        place-items: center;
        padding: 4px;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    
    .grid div{
        padding: 6px;
        border: 1px solid black;
        border-radius: 4px;
    }

    .grid h2{
        font-size: 20px;
    }
    
    .grid button{
        font-size: 20px;
        padding: 4px;
        width: 40px;
        height: 40px;
    }

    .counter {
        display: inline-block;
        width: 3ch; 
        padding: 0.5em;
    }
</style>