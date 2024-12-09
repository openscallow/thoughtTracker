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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=refresh" />
<input type="text" name="thought" bind:value={thought}>
<button type="button" onclick={initializeThouht}>create thought</button>

<div class="grid">
{#each Object.entries(thoughts) as [key, value]}
    <div class="card">
        <div class="thought">
            <p class="key">{key}</p>
        </div>
        <div class="buttons">
            <button onclick={()=>{decrement(key)}}>-</button>
            <span class="counter">{value.count}</span>
            <button onclick={()=>{increment(key)}}>+</button>
        </div>
    </div>
{/each}               
</div>

<button class="reset" onclick={()=>{reset()}}><span class="material-symbols-outlined">refresh</span>reset</button>

<style>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .grid{
        display: grid;
        grid-gap: 4px;
        place-items: center;
        padding: 2px;
        margin-top: 4px;
        grid-template-columns: 1fr 1fr;
    }
    
    .card{display: flex;
        flex-direction: column;
        justify-content: space-around;
        min-height: 180px;
        width: 100%;
        padding: 6px;
        border: 1px solid black;
        border-radius: 4px;
    }

    .grid p{
        width: 100%;
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

    .reset {
    display: inline-flex; /* Ensures icon and text align inline */
    align-items: center; /* Vertically centers icon and text */
    padding: 8px 12px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-family: 'Arial', sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.reset:hover {
    background-color: darkred;
}

.reset span.material-symbols-outlined {
    margin-right: 8px; /* Adds spacing between icon and text */
    font-size: 20px; /* Adjust icon size to match text */
    vertical-align: middle; /* Ensures smooth alignment */
}

</style>