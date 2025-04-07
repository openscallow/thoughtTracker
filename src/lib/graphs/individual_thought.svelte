<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount } from "svelte";

    let {thought, selectedMonth, selectedYear} = $props();

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

    let chart: Chart | null = null;
    let thoughts: Thoughts = $state({}); // Initialize thoughts as an empty object

    function updateChart() {
        const data = Array.from({ length: 31 }, (_, i) => ({
            date: i + 1,
            count: null as number | null,
        }));
      

        const storedThoughts = localStorage.getItem("thoughts");
        thoughts = storedThoughts ? JSON.parse(storedThoughts) : {}; 


        for (const key in thoughts){
            if(key === thought){
              
                let thoughtData = thoughts[key];
                for (const secondKey in thoughtData.records) {
                    const [day, month, year] = secondKey.split("/").map(Number);
           
                    if (month === selectedMonth && year === selectedYear) {
                       
                        const dataEntry = data.find((d) => d.date === day);
                        if (dataEntry) {
                            dataEntry.count = (dataEntry.count || 0) + thoughtData.records[secondKey].count;
                        }
                    }
                }
            }

            const thoughtVisual = document.getElementById("lineChart") as HTMLCanvasElement | null;
        if (thoughtVisual) {
            if (chart) {
                chart.destroy();
            }
            
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
        }
        }
    }
    onMount(() => {
        updateChart();
    });
</script>

<div class="graph-container">
    <canvas id="lineChart"></canvas>
</div>