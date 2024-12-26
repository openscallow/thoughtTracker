<script lang="ts">
    import { date } from "$lib/date";
    import Chart from 'chart.js/auto';
    import { onMount } from "svelte";
    import './style.css';
    import { CirclePlus, RefreshCcw } from 'lucide-svelte';

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

    const selectedMonth = 11; // November
    const selectedYear = 2024;

    let thoughts: Thoughts = {};
    let newThought: string = "";

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

        const data = Array.from({ length: 31 }, (_, i) => ({
            date: i + 1,
            count: null as number | null,
        }));

        for (const key in thoughts) {
            if (Object.prototype.hasOwnProperty.call(thoughts, key)) {
                for (const secondKey in thoughts[key].records) {
                    const [month, day, year] = secondKey.split("/").map(Number);

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
            new Chart(thoughtVisual, {
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
</script>
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