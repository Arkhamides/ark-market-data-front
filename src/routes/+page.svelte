<script lang="ts">
  import "iconify-icon";
  import { onMount } from "svelte";
  import { connectWebSocket, subscribe } from "$lib/websocket";

  import OrderBookData from "$lib/components/order-book-data.svelte";
  import ChatBot from "$lib/components/ChatBot.svelte";
  import AlertsPanel from "$lib/components/AlertsPanel.svelte";

  let bids: { price: number; quantity: number }[] = [];
  let asks: { price: number; quantity: number }[] = [];
  let btcPrice = 0;
  let spread = 0;
  const change24h = 1.0; // TODO: Replace with actual 24h change data

  // Mock stats data
  const mockStats = {
    volume24h: 847.3,
    status: "Connected",
  };

  onMount(() => {
    connectWebSocket();

    const unsubscribe = subscribe((data) => {
      if (data.bids && data.asks) {
        bids = data.bids.slice(0, 10);
        asks = data.asks.slice(0, 10);

        // Calculate mid price from top bid/ask
        if (data.bids.length > 0 && data.asks.length > 0) {
          const topBid = data.bids[0].price;
          const topAsk = data.asks[0].price;
          btcPrice = (topBid + topAsk) / 2;
          spread = (topAsk - topBid) / btcPrice * 100;
        }
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>MCP Market Data | HFT-grade data for AI traders</title>
</svelte:head>

<div class="terminal-wrapper">
  <!-- Header -->
  <header class="terminal-header">
    <div class="header-content">
      <div class="logo">
        <h1>AI Trading Terminal</h1>
        <p class="subtitle">HFT-grade data for AI traders</p>
      </div>
      <nav class="nav-links">
        <a href="#docs">Documentation</a>
        <a href="https://github.com/Arkhamides/mcp-market-data" target="_blank"
          >GitHub</a
        >
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <div class="terminal-content">
    <!-- Left Panel: Stats -->
    <aside class="side-panel left-panel">
      <div class="panel-section">
        <h3 class="panel-title">Market Data</h3>
        <div class="stat-item">
          <span class="stat-label">BTC/USD</span>
          <span class="stat-value"
            >${btcPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</span
          >
          <span class="stat-change positive">+{change24h}% (24h)</span>
        </div>
      </div>

      <div class="panel-section">
        <h3 class="panel-title">Connection</h3>
        <div class="status-indicator">
          <span class="status-dot connected"></span>
          <span>{mockStats.status}</span>
        </div>
      </div>
    </aside>

    <!-- Center: Order Book & Chatbot -->
    <main class="order-book-container">
      <OrderBookData {bids} {asks} />
      <ChatBot />
    </main>

    <!-- Right Panel: Stats -->
    <aside class="side-panel right-panel">
      <div class="panel-section">
        <h3 class="panel-title">Market Metrics</h3>
        <div class="stat-item">
          <span class="stat-label">Spread</span>
          <span class="stat-value">{spread.toFixed(4)}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24h Volume</span>
          <span class="stat-value">{mockStats.volume24h}K BTC</span>
        </div>
      </div>

      <div class="panel-section">
        <h3 class="panel-title">Exchanges</h3>
        <ul class="exchange-list">
          <li>✓ Binance</li>
          <li>✓ Kraken</li>
          <li>✓ Coinbase</li>
          <li>✓ CoinMarketCap</li>
        </ul>
      </div>

      <AlertsPanel />
    </aside>
  </div>

  <!-- Footer -->
  <footer class="terminal-footer">
    <div class="footer-content">
      <p>
        &copy; 2025 MCP Market Data. Open source • AI-native • Real-time
        aggregation
      </p>
      <div class="footer-links">
        <a href="#license">License</a>
        <a href="#privacy">Privacy</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    font-family: "JetBrains Mono", "Courier New", monospace;
    background-color: #0a0a0a;
    color: #e0e0e0;
  }

  .terminal-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    position: relative;
  }

  /* Grid Background */
  .terminal-wrapper::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        90deg,
        rgba(100, 100, 100, 0.03) 1px,
        transparent 1px
      ),
      linear-gradient(rgba(100, 100, 100, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
  }

  /* Header */
  .terminal-header {
    background: rgba(0, 0, 0, 0.7);
    border-bottom: 1px solid rgba(200, 200, 200, 0.1);
    padding: 1.5rem 2rem;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  .header-content {
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 2px;
    color: #fff;
  }

  .subtitle {
    font-size: 0.85rem;
    color: #888;
    margin: 0.25rem 0 0 0;
    font-weight: 400;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: #888;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
    border-bottom: 1px solid transparent;
  }

  .nav-links a:hover {
    color: #fff;
    border-bottom: 1px solid #888;
  }

  /* Main Content Area */
  .terminal-content {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 1rem;
    padding: 2rem;
    flex: 1;
    max-width: 1800px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1200px) {
    .terminal-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .left-panel,
    .right-panel {
      display: none;
    }
  }

  /* Side Panels */
  .side-panel {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 4px;
    padding: 1.5rem;
    backdrop-filter: blur(5px);
    max-height: fit-content;
  }

  .panel-section {
    margin-bottom: 2rem;
  }

  .panel-section:last-child {
    margin-bottom: 0;
  }

  .panel-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    margin: 0 0 1rem 0;
    font-weight: 600;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(100, 100, 100, 0.1);
  }

  .stat-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0.5rem 0;
    color: #fff;
  }

  .stat-change {
    font-size: 0.8rem;
    font-weight: 500;
  }

  .stat-change.positive {
    color: #22c55e;
  }


  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #22c55e;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-dot.connected {
    background-color: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .exchange-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
  }

  .exchange-list li {
    padding: 0.5rem 0;
    color: #888;
  }

  /* Order Book Container */
  .order-book-container {
    position: relative;
    z-index: 2;
  }

  /* Footer */
  .terminal-footer {
    background: rgba(0, 0, 0, 0.7);
    border-top: 1px solid rgba(200, 200, 200, 0.1);
    padding: 1.5rem 2rem;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  .footer-content {
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
  }

  .footer-content p {
    margin: 0;
    color: #888;
  }

  .footer-links {
    display: flex;
    gap: 2rem;
  }

  .footer-links a {
    color: #888;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: #fff;
  }
</style>
