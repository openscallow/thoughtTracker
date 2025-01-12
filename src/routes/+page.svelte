<script lang="ts">
    import { date } from "$lib/date";
    import Chart, { elements } from 'chart.js/auto';
    import { onMount } from "svelte";
    import './style.css';
    import { CirclePlus, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-svelte';

    interface ThoughtRecord {
        record: string[];
        count: number;
    }

    interface Thoughts {
        [key: string]: {
            count: number;
            records: Record<string, ThoughtRecord>;
        };
    }

    let selectedMonth: number = $state(12); // December
    let selectedYear: number = $state(2024); 

    let thoughts: Thoughts = $state({});
    let newThought: string = $state("");

    let chart: Chart | null = null;

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
        } catch (error) {
            console.error("Error parsing thoughts from localStorage", error);
            thoughts = {};
        }
    }

    function saveThoughts(): void {
        localStorage.setItem("thoughts", JSON.stringify(thoughts));
    }

    function addThought(): void {
        if (!newThought.trim()) return;

        thoughts[newThought] = { count: 0, records: {} };
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
        selectedMonth = parseInt(localStorage.getItem("selectedMonth") ?? selectedYear.toString());
        selectedYear = parseInt(localStorage.getItem("selectedYear") ?? selectedYear.toString());

        const data = Array.from({ length: 31 }, (_, i) => ({
            date: i + 1,
            count: null as number | null,
        }));

        for (const key in thoughts) {
            if (Object.prototype.hasOwnProperty.call(thoughts, key)) {
                for (const secondKey in thoughts[key].records) {
                    const [day, month, year] = secondKey.split("/").map(Number);
                    console.log(month, selectedMonth, year, selectedYear);
                    if (month === selectedMonth && year === selectedYear) {
                        const dataEntry = data.find((d) => d.date === day);
                        if (dataEntry) {
                            dataEntry.count = (dataEntry.count || 0) + thoughts[key].records[secondKey].count;
                        }
                    }
                }
            }
        }

        const thoughtVisual = document.getElementById("lineChart") as HTMLCanvasElement | null;
        if (thoughtVisual) {
            chart = new Chart(thoughtVisual, {
                type: "bar",
                data: {
                    labels: data.map((row) => row.date.toString()),
                    datasets: [
                        {
                            label: "Daily Counts",
                            data: data.map((row) => row.count),
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        tooltip: { enabled: true },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { autoSkip: true },
                        },
                        y: { beginAtZero: true },
                    },
                    layout: {
                        padding: { top: 10, left: 10, right: 10, bottom: 10 },
                    },
                },
            });
        } else {
            console.error('Canvas element with id "lineChart" not found.');
        }
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
    <canvas id="lineChart"></canvas>
</div>