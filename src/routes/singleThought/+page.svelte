<script lang="ts">
    import IndividualThought from "$lib/graphs/individual_thought.svelte";
    import { mount } from 'svelte';
    import { onMount } from "svelte";

    // State variables for tracking selected date and thought
    let selectedMonth: number = $state(2);
    let selectedYear: number = $state(2025);
    let selectedThought: string = $state('');

    // Type definitions for data structures
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

    // State variables for thoughts data
    let thoughts: Thoughts = $state({});
    let thought: string[] = $state([]);

    /**
     * Updates the graph visualization based on selected thought and date
     * Removes existing graph if present and mounts a new component with updated props
     */
    function updateGraph() {
        // Find existing graph container
        const container = document.querySelector('div:has(> canvas)');
    
        // Remove existing graph if found
        if (container) {
            container.remove();
        }
    
        // Create and append new container for the graph
        const newContainer = document.createElement('div');
        document.body.appendChild(newContainer);
        
        // Mount the IndividualThought component with current selections
        mount(IndividualThought, {
            target: newContainer,
            props: {
                thought: selectedThought,
                selectedMonth,
                selectedYear
            }
        });
    }

    /**
     * On component mount, load thoughts data from localStorage
     * and populate the thought array for the dropdown
     */
    onMount(() => {
        // Retrieve stored thoughts from localStorage
        const storedThoughts = localStorage.getItem("thoughts");
        thoughts = storedThoughts ? JSON.parse(storedThoughts) : {};

        // Populate thought array with keys from thoughts object
        for (const key in thoughts) {
            thought.push(key);
        }
    });
</script>

<!-- User selection controls -->
<div class="controls">
    <!-- Thought selection dropdown -->
    <div class="control-item">
        <label for="thought-select">Select Thought:</label>
        <select id="thought-select" name="thought" bind:value={selectedThought}>
            {#each thought as thoughtItem}
                <option value={thoughtItem}>{thoughtItem}</option>
            {/each}
        </select>
    </div>
    
    <!-- Date selection inputs -->
    <div class="control-item">
        <label for="month-input">Month:</label>
        <input id="month-input" type="number" name="selectedMonth" bind:value={selectedMonth} min="1" max="12">
    </div>
    
    <div class="control-item">
        <label for="year-input">Year:</label>
        <input id="year-input" type="number" name="selectedYear" bind:value={selectedYear} min="2000" max="2100">
    </div>
    
    <!-- Update graph button -->
    <button on:click={updateGraph}>Update Graph</button>
</div>

<!-- Graph container will be added dynamically by the updateGraph function -->

<style>
    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        align-items: center;
    }
    
    .control-item {
        display: flex;
        flex-direction: column;
    }
    
    label {
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }
    
    button {
        align-self: flex-end;
        padding: 0.5rem 1rem;
        background-color: #4a5568;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
    
    button:hover {
        background-color: #2d3748;
    }
</style>