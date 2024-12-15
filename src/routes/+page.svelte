
<script lang="ts">
    import { date } from "$lib/date";
    import Chart from 'chart.js/auto';
    import { onMount } from "svelte";
    import './style.css'
    import { CirclePlus, RefreshCcw } from 'lucide-svelte';

    

    onMount(() => {
// Define the selected month and year (e.g., November 2024)
const selectedMonth = 11; // November (use 1-based month numbering)
const selectedYear = 2024;

// Generate the data array with dates from 1 to 31
const data = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1, // Dates from 1 to 31
    count: null, // Initialize count to null
}));

for (const key in thoughts) {
    if (Object.prototype.hasOwnProperty.call(thoughts, key)) {
        for (const secondKey in thoughts[key].records) {
            if (Object.prototype.hasOwnProperty.call(thoughts[key].records, secondKey)) {
                // Parse the date string to extract the month, day, and year
                const dateParts = secondKey.split('/'); // Assuming 'MM/DD/YYYY' format
                const day = parseInt(dateParts[0], 10); // Extract the month as an integer
                const month = parseInt(dateParts[1], 10); // Extract the day as an integer
                const year = parseInt(dateParts[2], 10); // Extract the year as an integer

                // Process only if the record is in the selected month and year
                if (month === selectedMonth && year === selectedYear) {
                    // Find the corresponding entry in the `data` array
                    const dataEntry = data.find(d => d.date === day);
                    if (dataEntry) {
                        // Update the count in the `data` array
                        dataEntry.count = (dataEntry.count || 0) + thoughts[key].records[secondKey].count;

                        console.log(
                            `Updated count for date ${day}/${selectedMonth}/${selectedYear}:`,
                            dataEntry.count
                        );
                    }
                }
            }
        }
    }
}
        const thoughtVisual = document.getElementById('lineChart'); // Ensure DOM is ready
        if (thoughtVisual) {
            // Create data for 31 days with random counts (replace this with your real data)
            

            new Chart(thoughtVisual, {
                type: 'bar',
                data: {
                    labels: data.map(row => row.date),
                    datasets: [
                        {
                            label: 'Daily Counts',
                            data: data.map(row => row.count),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: { enabled: true },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                      
                            ticks: {
                                autoSkip: true, // Show all labels
                            },
                        },
                        y: {
                            beginAtZero: true,
                       
                        },
                    },
                    layout: {
                        padding: {
                            top: 10,
                            left: 10,
                            right: 10,
                            bottom: 10,
                        },
                    },
                    barPercentage: 0.6, // Controls the width of bars
                    categoryPercentage: 0.8, // Space between bars
                },
            });
        } else {
            console.error('Canvas element with id "lineChart" not found.');
        }
    });

 
    // Ensure 'thoughts' key exists on localStorage
    function initializeStorage(){
        if(!localStorage.getItem('thoughts')){
            localStorage.setItem('thoughts', '{}')
        }
    }
    initializeStorage()


    let thoughts = $state(JSON.parse(localStorage.getItem('thoughts')))
    let newThought:string = $state();
    
    function addThought(){
        thoughts[newThought] = {count: 0, records:{}}
        localStorage.setItem('thoughts',JSON.stringify(thoughts))

        // Reasign 'thoughts' to ensure the state is in sync with localStorage
        thoughts = JSON.parse(localStorage.getItem('thoughts'))
        newThought = ''
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
        thoughts = JSON.parse(localStorage.getItem('thoughts'))
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
        thoughts = JSON.parse(localStorage.getItem('thoughts'))
    }

    function reset() {
        let keys = document.getElementsByClassName('key');
        keys = Array.from(keys); // Convert to array
        keys.forEach(key => {
        console.log(key.innerText);
        thoughts[key.innerText].count = 0
        localStorage.setItem('thoughts', JSON.stringify(thoughts))
        });
        thoughts = JSON.parse(localStorage.getItem('thoughts'))
    }
    

 
</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=refresh" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add_circle" />
<div class="inputContainer">
    <div class="inputGroup">
        <input type="text" name="newThought" bind:value={newThought} placeholder="Create new thought">
        <button type="button" onclick={addThought}><CirclePlus class="material-symbols-outlined"/></button>
    </div>  
</div>

<div class="grid">
{#each Object.entries(thoughts) as [key, value]}
    <div class="card">
        <div class="newThought">
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

<div class="resetContainer">
    <button class="reset" onclick={()=>{reset()}}><RefreshCcw class="material-symbols-outlined"></RefreshCcw>reset</button>
</div>
<div style="width: 100%; max-width: 600px; margin: auto;">
    <canvas id="lineChart"></canvas>
</div>