<script lang="ts">
    import { onMount } from "svelte";
    import { date } from "$lib/date";
    import './style.css'

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

    // state variable
    let disableThought = $state([])
    let thoughts: Thoughts
    onMount(()=>{
        thoughts = JSON.parse(localStorage.getItem("thoughts"));
        if(thoughts){
            for(const thought in thoughts){
                if(thoughts[thought].status === 'inactive'){
                    disableThought.push([thought,thoughts[thought]])
                }
            }
        }
    })
    
    // restore thought on thoughts object 
    function restore(thought){
        let thoughtName = thought[0]
        let keyDate = date()
        console.log(thoughtName + ":")
        thoughts[thoughtName].count = 1
        thoughts[thoughtName].status = 'active'
        thoughts[thoughtName].records[keyDate] = {
            count: 1,
            record: [new Date().toISOString()]
        }
        console.log(thoughts)
        localStorage.setItem("thoughts", JSON.stringify(thoughts));
        window.location.reload
    }

    // /////////unexpected behavior of js
    // function restore(thought){
    //     // thought.status = 'active';
    //     // let thoughtName = thought[0]
    //     console.log(thoughts[thought][0])
        
    //     console.log(date())

    // }
</script>



<!-- Ui for disable thoughts and restore button -->
{#each disableThought as thought}
    <div id="container">
        <input type="text" value={thought[0]} readonly disabled>
        <button onclick={()=>restore(thought)}>Restore</button>
    </div> 
{/each}
