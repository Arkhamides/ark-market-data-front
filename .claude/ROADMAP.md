# MCP Market Data — Product Roadmap

*Last updated: 2026-03-23*

---

## The Strategic Context

AI agents are becoming economic actors. The window to become the default AI-native quant infrastructure is **2025–2026** — before larger platforms internalize MCP and before the market prices in near-term AGI. This roadmap is built around one principle: **one full loop done perfectly beats ten half-finished features.**

The full loop: `natural language strategy → code/rules generation → backtest → live sim → actionable metrics`

---

## Phase 0 — Validate (Now → Week 4)

**Goal:** Confirm that algo traders and AI developers will pay for plug-and-play strategy validation. Do not build ahead of signal.

### Milestones
- [ ] 10–20 user interviews completed (algo traders, quant devs, AI builders)
- [ ] Public demo flow published: NL strategy → backtest → metrics (video, ≤60s)
- [ ] "Wire your strategy for free" outreach to r/algotrading, quant discords, X
- [ ] Identify the 3 sharpest pain points in their own words
- [ ] First 5 users who run a backtest and return within a week

### Key Question
*Will someone describe a strategy in chat, run a backtest, and come back the next day?*

### Success Signal
5–10 users who connect, run multiple backtests, and return organically within one week.

---

## Phase 1 — Build the Core Slice (Weeks 4–10)

**Goal:** Ship the smallest monetizable version of the full loop. Nothing more.

### What to Build
- [ ] **MCP server** — stable, documented, one-line connection from Claude Desktop or any MCP client
- [ ] **Historical data layer** — multi-exchange (Binance, Kraken, Coinmarketcap minimum), accurate OHLCV, queryable by AI tools
- [ ] **Backtest orchestration** — AI submits strategy rules, engine runs simulation, returns P&L, drawdown, win rate, Sharpe
- [ ] **Live sim (paper trading)** — forward test against real-time feed, no capital at risk
- [ ] **C++ backend** — latency benchmarks vs. direct APIs documented and publishable

### What NOT to Build Yet
- Execution integrations (Freqtrade, CCXT) — Phase 3
- Team/multi-user features — Phase 4
- Custom dashboards or heavy frontend — keep it terminal/API-first

### Success Signal
A user describes a BTC momentum strategy in Claude, gets a backtest with real metrics in under 60 seconds.

---

## Phase 2 — Free Tier Launch & PMF Signal (Weeks 10–16)

**Goal:** Get real usage data. Find the paid conversion triggers.

### Launch Channels
- [ ] Post demo flows in r/algotrading, r/QuantFinance, quant discords, MCP/Claude communities
- [ ] Publish latency benchmarks vs. direct exchange APIs
- [ ] Publish historical data accuracy and exchange coverage metrics
- [ ] Submit to MCP server directories and AI tool registries

### Free Tier Constraints (intentional friction → upgrade triggers)
- Limited pairs (e.g., BTC, ETH only)
- Shallow historical depth (e.g., 30 days)
- Rate-limited real-time feed
- No persistent backtest storage

### Conversion Triggers to Watch
- "I need more history" → Tier 1
- "I need more pairs" → Tier 1
- "I need concurrent live tests" → Tier 1
- "I need private instance / priority" → Tier 2

### Success Signal
2–3 users convert to paid without prompting. At least one says "I need more [X]."

---

## Phase 3 — Execution Integration (Weeks 16–24)

**Goal:** Close the loop from validation to live trading. BYO-keys, BYO-execution model — no custody risk.

### What to Build
- [ ] **Freqtrade integration** — user brings their own Freqtrade instance, MCP Market Data feeds it signals
- [ ] **CCXT integration** — generic execution via user's own API keys
- [ ] **Signal export** — structured output format (JSON/webhook) for custom execution pipelines
- [ ] **Backtest → live handoff** — one-click transition from validated backtest to paper, then to live

### Positioning
Frame explicitly: *"We validate. You execute. Your keys, your broker, your risk."* This directly addresses the user anxiety ("what if I need execution later?") without taking on custody or regulatory exposure.

### Success Signal
At least one user runs a strategy from NL description → backtest → paper → live, entirely within MCP Market Data tooling.

---

## Phase 4 — Team Plans & Desk-Grade Features (Weeks 24–40)

**Goal:** Move upmarket to small trading desks and funds. "Strategy validation as a service."

### What to Build
- [ ] **Team workspaces** — shared backtest runs, strategy library, role-based access
- [ ] **Deeper history** — 2–5 year OHLCV per pair for institutional-grade backtesting
- [ ] **Priority data streams** — dedicated feed allocation, SLA-backed uptime
- [ ] **Private instances** — self-hosted or cloud-isolated MCP server for compliance-sensitive desks
- [ ] **Batch backtest API** — run hundreds of parameter variations programmatically
- [ ] **Portfolio-level simulation** — multi-strategy, correlated drawdown analysis

### Pricing Model Evolution
| Tier | Target | Price Range |
|---|---|---|
| Free | Validation, exploration | €0 |
| Indie / Dev | Solo algo traders, AI devs | €29–99/mo |
| Pro / Desk | Small funds, trading teams | Higher flat + usage-based |
| Enterprise | Funds needing private infra | Custom |

### Success Signal
First Pro/Desk contract from a team of 2+ people. First "strategy validation as a service" deal with a small fund.

---

## Phase 5 — AI Agent Infrastructure Layer (Weeks 40+)

**Goal:** Become the standard data + validation layer for autonomous trading agents.

This phase maps directly to the Aschenbrenner thesis: as AI agents become economic actors (2026–2027), they will need reliable, low-latency, AI-native market data infrastructure. The product that is already embedded in their workflows wins by default.

### What to Build
- [ ] **Agent-optimized tool schema** — MCP tools designed for agentic reasoning loops, not just human-facing queries
- [ ] **Strategy memory / versioning** — agents can recall, compare, and iterate on past backtests across sessions
- [ ] **Multi-agent support** — separate agents for research, backtesting, and execution can coordinate via shared MCP state
- [ ] **Real-time alert tooling** — agents can subscribe to price/signal conditions and act autonomously
- [ ] **Audit trail** — every agent action logged and inspectable (critical for trust in autonomous systems)

### Positioning
*"If AI is going to manage portfolios, it needs HFT-grade data. That's what we build."*

---

## Guiding Principles

**1. One loop, done perfectly.**
Don't ship Phase 3 before Phase 1 is airtight. The full NL → backtest → live sim loop is the product. Everything else is a multiplier on top of it.

**2. Show, don't tell.**
Every marketing move leads with a working demo and concrete metrics (P&L curves, latency numbers, win rates). No hype.

**3. The window is narrow.**
Algo traders adopting AI-native tooling in 2025–2026 will compound significant workflow advantages. First-mover on MCP-native quant infra is durable — the switching cost compounds with every backtest run stored and every strategy iterated.

**4. Infrastructure compounds.**
Unsexy infra wins. A reliable, fast, accurate data layer is a higher moat than a slick UI. Invest in C++ performance, data accuracy, and uptime before investing in product surface area.

**5. BYO everything sensitive.**
Keys, execution, custody — always the user's. This keeps regulatory complexity out and trust high at every stage.

---

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Data accuracy distrust ("is your historical data correct?") | Publish accuracy methodology, source transparency, comparison vs. direct exchange data |
| Reliability anxiety for live trading | SLA documentation, uptime dashboard, paper trading as on-ramp |
| MCP adoption slower than expected | Build REST/WebSocket fallback so non-MCP users can still access the data layer |
| Larger platform (QuantConnect, etc.) ships MCP natively | Double down on HFT-grade performance and multi-exchange depth — they can't match C++ backend easily |
| AGI timeline wrong (window extends) | Doesn't matter — the pain point (wiring data infra for algo trading) is real regardless of AI timelines |

---

*This roadmap is a living document. Update it when PMF signal changes, not on a fixed calendar.*
