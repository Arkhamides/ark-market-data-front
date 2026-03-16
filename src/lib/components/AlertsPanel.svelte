<script lang="ts">
  import { onMount } from "svelte";
  import { alertsStore, type Alert } from "$lib/stores/alerts";

  let loading: boolean = false;

  async function fetchAlerts() {
    loading = true;
    await alertsStore.refresh();
    loading = false;
  }

  // Subscribe to store changes for debugging
  let alertCount = 0;
  const unsubscribe = alertsStore.subscribe((alerts) => {
    alertCount = alerts.length;
    console.log("Alerts store updated:", alerts);
  });

  // Fetch alerts on mount and periodically
  onMount(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Refresh every 10 seconds
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  });

  function getAlertStatus(alert: Alert): string {
    if (alert.triggered) return "triggered";
    return "active";
  }

  function getAlertLabel(alert: Alert): string {
    if (alert.type === "price") {
      const price = (alert.price || alert.threshold) as number;
      return `${alert.symbol} @ $${price}`;
    } else if (alert.type === "percent_change") {
      const threshold = (alert.percent_change || alert.threshold) as number;
      return `${alert.symbol} ±${threshold}%`;
    }
    return alert.type || "Unknown";
  }
</script>

<div class="alerts-panel">
  <div class="panel-header">
    <h3 class="panel-title">Active Alerts</h3>
    <button class="refresh-btn" on:click={fetchAlerts} disabled={loading}>
      {loading ? "..." : "↻"}
    </button>
  </div>

  <div class="alerts-content">
    {#if $alertsStore.length === 0}
      <p class="empty-state">No active alerts</p>
    {:else}
      <div class="alerts-list">
        {#each $alertsStore as alert}
          <div class={`alert-item alert-${getAlertStatus(alert)}`}>
            <div class="alert-label">{getAlertLabel(alert)}</div>
            <div class="alert-badge">{getAlertStatus(alert)}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .alerts-panel {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 4px;
    overflow: hidden;
    backdrop-filter: blur(5px);
  }

  .panel-header {
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    margin: 0;
    font-weight: 600;
  }

  .refresh-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .refresh-btn:hover:not(:disabled) {
    color: #888;
  }

  .refresh-btn:disabled {
    opacity: 0.5;
  }

  .alerts-content {
    padding: 1rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .empty-state {
    color: #666;
    font-size: 0.85rem;
    margin: 0;
  }

  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .alert-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    border: 1px solid rgba(100, 100, 100, 0.2);
  }

  .alert-item.alert-active {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  }

  .alert-item.alert-triggered {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .alert-label {
    color: #e0e0e0;
    font-weight: 500;
  }

  .alert-badge {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-weight: 600;
  }

  .alert-item.alert-active .alert-badge {
    background: rgba(34, 197, 94, 0.3);
    color: #22c55e;
  }

  .alert-item.alert-triggered .alert-badge {
    background: rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  /* Scrollbar styling */
  .alerts-content::-webkit-scrollbar {
    width: 6px;
  }

  .alerts-content::-webkit-scrollbar-track {
    background: rgba(100, 100, 100, 0.1);
  }

  .alerts-content::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.3);
    border-radius: 3px;
  }

  .alerts-content::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.5);
  }
</style>
