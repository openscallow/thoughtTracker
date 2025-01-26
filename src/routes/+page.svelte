<script lang="ts">
    import { date } from "$lib/date";
    import { onMount } from "svelte";
    import AllThoughts from "$lib/graphs/all_thoughts.svelte";
    import './style.css';
    import { CirclePlus, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-svelte';
    import type { ac } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";



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

    let selectedMonth: number = $state(12); // December
    let selectedYear: number = $state(2024); 

    let thoughts: Thoughts = $state({});
    let newThought: string = $state("");
    let thoughtsInfo = $state([]);

    // let chart: Chart | null = null;

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

    function inActiveThought(){
        thoughtsInfo.forEach((thought) => {
            if(thought.lastUpdate === undefined) thought.lastUpdate = date();

            let currentDate = parseInt(date().split("/")[0]);
            let lastUpdate = parseInt(thought.lastUpdate.split("/")[0]);

            if(currentDate - lastUpdate > 7 && thoughts[thought.name].status === 'active') {
                alert("Bravo You have beat the thought " + thought.name);
                thoughts[thought.name].status = 'inactive';
            }
        })

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
    }

    function increment(key: string): void {
        const currentDate = date();
        const record = thoughts[key].records[currentDate] || { record: [], count: 0 };

        record.count += 1;
        record.record.push(new Date().toISOString());
        thoughts[key].records[currentDate] = record;
        thoughts[key].count += 1;

        saveThoughts();
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
    }

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
{#each Object.entries(thoughts) as [key, value]}
{#if value.status === 'active'}
    <div class="card">
        <div class="newThought">
            <p class="key">{key}</p>
        </div>
        <div class="buttons">
            <button class="countNegative" onclick={()=>{decrement(key)}}><ChevronLeft /></button>
            <span class="counter">{value.count}</span>
            <button class="countPositive" onclick={()=>{increment(key)}}><ChevronRight /></button>
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

