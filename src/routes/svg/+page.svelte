<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    let ws: WebSocket;
    let messages: string[] = [];
    let messageInput = '';
    
    onMount(() => {
        ws = new WebSocket('ws://localhost:3000');
        
        ws.onmessage = (event) => {
            messages = [...messages, event.data];
        };
        
        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    });
    
    onDestroy(() => {
        if (ws) ws.close();
    });
    
    function sendMessage() {
        if (messageInput.trim() && ws.readyState === WebSocket.OPEN) {
            ws.send(messageInput);
            messageInput = '';
        }
    }
</script>

<div class="chat-container">
    <div class="messages">
        {#each messages as message}
            <p>{message}</p>
        {/each}
    </div>
    
    <div class="input-area">
        <input
            type="text"
            bind:value={messageInput}
            on:keydown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
        />
        <button on:click={sendMessage}>Send</button>
    </div>
</div>

<style>
    .chat-container {
        max-width: 600px;
        margin: 20px auto;
    }
    
    .messages {
        height: 300px;
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
    }
    
    .input-area {
        display: flex;
        gap: 10px;
    }
    
    input {
        flex: 1;
        padding: 8px;
    }
    
    button {
        padding: 8px 16px;
    }
</style>
