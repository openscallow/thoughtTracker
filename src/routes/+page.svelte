<script lang="ts">
    import { date } from "$lib/date";
    import { onMount } from "svelte";
    import AllThoughts from "$lib/graphs/all_thoughts.svelte";
    import './style.css';
    import { 
        CirclePlus, 
        RefreshCcw, 
        ChevronLeft, 
        ChevronRight, 
        EllipsisVertical } from 'lucide-svelte';

    interface ThoughtRecord {
        record: string[];
        count: number;
    }

    type Status = 'active' | 'inactive';

    interface Thoughts {
        [key: string]: {
            count: number;
            records: Record<string, ThoughtRecord>;
            status: Status;
        };
    }

    let selectedMonth: number = $state(12); 
    let selectedYear: number = $state(2024); 

    let thoughts: Thoughts = $state({});  
    let newThought: string = $state("");
    let thoughtsInfo = $state([]);


    // Helper to initialize `localStorage`
    function initializeStorage(): void {
        if (!localStorage.getItem("thoughts")) {
            localStorage.setItem("thoughts", "{}");
        }
        loadThoughts();
    }

    // Helper to load thoughts from `localStorage`
    function loadThoughts(): void {
        try {
            const storedThoughts = localStorage.getItem("thoughts");
            thoughts = storedThoughts ? JSON.parse(storedThoughts) : {};

            // insert status property on old thoughts
            for (const key in thoughts) {
                if (!Object.hasOwn(thoughts[key], "status")) {
                    thoughts[key].status = 'active';
                    $inspect("not count" + thoughts[key]);
                }
            }
            saveThoughts();
            populateThoughtsInfo();
        } catch (error) {
            console.error("Error parsing thoughts from localStorage", error);
            thoughts = {};
        }
    }

    function populateThoughtsInfo(): void {
        thoughtsInfo = Object.entries(thoughts).map(([key, value], index) => ({
            id: index,
            name: key,
            count: value.count,
            lastUpdate:  Object.keys(value.records).pop(),
            records: value.records,
        }));

        inActiveThought()
    }

    /**
     * Checks and updates the status of thoughts based on inactivity period.
     * Iterates through all thoughts, calculating the time difference between
     * their last update and current date. If a thought hasn't been updated
     * for more than 7 days and is currently active, it's marked as inactive.
     * Displays an alert when a thought becomes inactive and saves the updated
     * thought status.
     */
    export function inActiveThought(){
        // Helper to convert "DD/MM/YYYY" string to a JavaScript Date object.
        function parseDate(str: string): Date {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
    
        thoughtsInfo.forEach((thought) => {
            // If lastUpdate is undefined, initialize it to the current date.
            if (!thought.lastUpdate) {
                thought.lastUpdate = date();
            }
    
            // Get current date and last update as strings.
            const currentDateStr = date();
            const lastUpdateStr = thought.lastUpdate;
    
            // Parse the date strings into Date objects.
            const currentDateObj = parseDate(currentDateStr);
            const lastUpdateObj = parseDate(lastUpdateStr);
    
            // Calculate difference in days.
            const diffTime = currentDateObj.getTime() - lastUpdateObj.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
            console.log(`Name: ${thought.name} | Current Date: ${currentDateStr} | Last Update: ${lastUpdateStr} | Diff Days: ${diffDays}`);
    
            // If the difference exceeds 7 days and the thought is active, mark it as inactive.
            if(diffDays > 7 && thoughts[thought.name].status === 'active') {
                alert("Bravo You have beat the thought " + thought.name);
                thoughts[thought.name].status = 'inactive';
            }
        });
    
        saveThoughts();
    }

    function saveThoughts(): void {
        localStorage.setItem("thoughts", JSON.stringify(thoughts));
    }

    function addThought(): void {
        if (!newThought.trim()) return;

        thoughts[newThought] = {status:'active', count: 0, records: {} };
        saveThoughts();
        newThought = "";
        populateThoughtsInfo();
    }
    
    // increment and decrement functions
    function increment(key: string): void {
        const currentDate = date();
        const record = thoughts[key].records[currentDate] || { record: [], count: 0 };

        record.count += 1;
        record.record.push(new Date().toISOString());
        thoughts[key].records[currentDate] = record;
        thoughts[key].count += 1;

        saveThoughts();
        populateThoughtsInfo();
    }

    function decrement(key: string): void {
        if (thoughts[key].count <= 0) return;

        const currentDate = date();
        const record = thoughts[key].records[currentDate];

        if (record) {
            record.count = Math.max(0, record.count - 1);
            record.record.pop();
        }
        thoughts[key].count = Math.max(0, thoughts[key].count - 1);

        saveThoughts();
        populateThoughtsInfo();
    }

    // reset function
    function reset(): void {
        for (const key in thoughts) {
            if (Object.prototype.hasOwnProperty.call(thoughts, key)) {
                thoughts[key].count = 0;
            }
        }
        saveThoughts();
    }

    onMount(() => {
        initializeStorage();
        selectedMonth = parseInt(localStorage.getItem("selectedMonth") ?? selectedMonth.toString());
        selectedYear = parseInt(localStorage.getItem("selectedYear") ?? selectedYear.toString());
    });

    function upDateMonth() {
        let month = document.getElementById("month") as HTMLSelectElement;
        localStorage.setItem("selectedMonth", month.value);
        window.location.reload();
    }

    function upDateYear() {
        let year = document.getElementById("year") as HTMLSelectElement;
        localStorage.setItem("selectedYear", year.value);
        window.location.reload();
    }

    function showProperties(index: number) {
        let properties = document.querySelector(`.thought${index}`) as HTMLElement;
        properties.classList.toggle("show");
    }

</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Zain:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,300;1,400&display=swap" rel="stylesheet">
</svelte:head>
<div class="inputContainer">
    <div class="inputGroup">
        <input type="text" name="newThought" bind:value={newThought} placeholder="Create new thought">
        <button type="button" onclick={addThought}><CirclePlus class="material-symbols-outlined"/></button>
    </div>  
</div>

<div class="grid">
{#each thoughtsInfo as thought, index}
{#if thoughts[thought.name].status === 'active'}
    <div class="card">
        <div class="newThought"> 
            <p class="key">{thought.name}</p>
        </div>
        <div class="buttons">
            <button class="countNegative" onclick={()=>{decrement(thought.name)}}><ChevronLeft /></button>
            <span class="counter">{thought.count}</span>
            <button class="countPositive" onclick={()=>{increment(thought.name)}}><ChevronRight /></button>
        </div>
        <div class="propetieWrapper">
            <button class="dots" onclick={()=>showProperties(index)}><EllipsisVertical /></button>
            <div class="properties thought{index}">
                <ul>
                    <li>last Update: {thought.lastUpdate}</li>
                </ul>
            </div>
        </div>
            
    </div>
{/if}
{/each}             
</div>

<div class="resetContainer">
    <button class="reset" onclick={()=>{reset()}}><RefreshCcw class="material-symbols-outlined"></RefreshCcw>reset</button>
</div>

<select onchange={upDateMonth} id="month">
    <option value=""></option>
    {#each {length:12} as _, month}
        <option value={month+1}>{month+1}</option>
    {/each}
</select>
{selectedMonth}
<select onchange={upDateYear} id="year">
    <option value=""></option>
    <option value="2024">2024</option>
    <option value="2025">2025</option>
</select>
{selectedYear}

<div style="width: 100%; max-width: 600px; margin: auto;">
    <AllThoughts {thoughts} {selectedMonth} {selectedYear} />
</div>

