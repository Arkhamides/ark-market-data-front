# Product Marketing Context: MCP Market Data

*Last updated: 2026-03-22*

## Product Overview

**One-liner:** AI-native backtesting and live validation for crypto strategies, via MCP.

**Core promise:** Describe a strategy in chat, get instant backtests on historical data and live forward tests with HFT-grade feeds.

**What it does:** MCP Market Data is an MCP server that aggregates real-time cryptocurrency market data from multiple exchanges (Binance, Kraken, Coinmarketcap, etc.) and enables AI agents to run backtests, forward tests, and live market analysis natively. Built with a C++ backend optimized for low-latency HFT-grade performance. The full loop: natural language strategy → code/rules generation → backtest → metrics (P&L, drawdown, win rate).

**Product category:** AI infrastructure / quant tooling

**Product type:** MCP server + backtesting/validation layer (open-source core, commercial tiers)

**Business model:** Freemium SaaS — free tier for validation, paid tiers for capacity (history depth, pairs, throughput, concurrent live tests)

---

## Target Audience

**Primary users:**
- Algo traders and quant developers building crypto strategies
- AI/LLM developers integrating market data into agents
- Independent traders who want to test strategies without wiring infra

**Secondary users:**
- Small trading desks and funds needing validation tooling
- Developers in communities: r/algotrading, r/QuantFinance, quant/AI discords

**Decision-makers:** Individual developers, indie traders, small trading teams

**Primary use case:** Describe a strategy in natural language → AI generates and runs a backtest → surfaces actionable metrics — without touching data infrastructure

**Jobs to be done:**
- Test strategies on real historical data without building data + simulation infra
- Validate strategies live before committing capital
- Connect AI agents to real-time multi-exchange market data
- Eliminate the "wiring" problem between LLMs and market data

**Use cases:**
- "Write a BTC momentum strategy and backtest it on the last 6 months" — in chat
- Live forward-test a strategy on paper before deploying to a real bot
- Trading agents that monitor prices, alert on signals, and surface metrics
- AI-powered market research and backtesting for quant developers

---

## Problems & Pain Points

**Core problems:**
1. Wiring data feeds + simulation infrastructure is the most tedious part of algo trading — most time is spent on plumbing, not strategy
2. No plug-and-play way to go from "strategy idea" → backtest → live test, especially for AI-assisted workflows
3. Integrating crypto data into AI applications requires custom work (API keys, auth, wrappers)
4. Aggregating data across exchanges is complex, high-latency, and fragile

**Why alternatives fall short:**
- Direct exchange APIs: Multiple integrations, auth overhead, rate limits, no unified backtesting
- Traditional quant platforms (QuantConnect, Backtrader): Not AI-native, no MCP, heavy setup
- Building custom infra: Weeks of engineering before testing a single strategy
- Existing MCP servers: Market data only, no backtest/sim layer

**What it costs them:**
- Weeks of engineering before testing a single strategy
- Missing alpha from strategies they never validated
- Latency and reliability issues in live data
- Complexity that kills momentum

---

## Differentiation

**Key differentiators:**
- **Full AI-native loop:** Natural language strategy spec → code/rules generation → backtest → live sim — no manual plumbing
- **HFT-grade data layer:** C++ backend, multi-exchange aggregation, real-time and historical
- **MCP protocol:** Works natively with Claude and any MCP-compatible AI — zero custom connectors
- **No execution risk at entry:** Start with paper trading / live sim; users plug in their own broker when ready
- **Open-source core:** Transparent, community-driven, no lock-in

**How we do it differently:**
- Other quant platforms require you to bring your own data and write simulation code
- Other crypto data providers aren't AI-native and have no strategy loop
- Other MCP servers give you data but not the backtesting orchestration layer

**Why users choose us:**
- Fastest path from "I have a strategy idea" to "I have backtest metrics"
- HFT-grade performance without building it yourself
- Works with Claude (and any MCP AI) natively
- Paper trading/sim first — no capital at risk to start

---

## Pricing Strategy

**Tier 0 — Free:**
- Limited pairs, rate-limited real-time data, shallow historical depth
- No long-term storage of backtest runs
- Goal: get users building and giving feedback

**Tier 1 — Indie / Dev (29–99 €/mo):**
- More pairs, deeper history, higher throughput, more concurrent live tests
- Suitable for solo algo traders and AI developers

**Tier 2 — Pro / Desk (higher flat + usage-based):**
- Unlimited pairs, deep history, priority support, private instances
- Scales with API calls / active strategies / live streams

**Optional:** "Backtest credits" pay-per-use for users who don't want a subscription yet

---

## Go-to-Market Channels

**Communities:**
- r/algotrading, r/QuantFinance
- Quant/AI discords, X (trading/AI threads), Claude/MCP communities

**Key offer:** "I'll wire one of your existing strategies to MCP Market Data for free; you keep the strategy, I keep the feedback."

**Content:**
- Short videos: "I asked a chatbot to invent a BTC strategy and backtested it in 30 seconds"
- Public demo flows: write strategy → backtest → live sim, shown in communities

**Success signals (weeks 4–8):**
- 5–10 users who connect, run multiple backtests, and return within a week
- 2–3 convert to paid ("I need more history / pairs / capacity")

---

## Switching Dynamics

**Push:** Frustration with slow integrations, multiple API keys, latency, weeks of setup before first backtest

**Pull:** One-line MCP connection, natural language → instant backtest, HFT-grade speed, paper trading to start

**Habit:** Developers are used to writing custom integrations or using heavy quant platforms

**Anxiety:** "Will this be reliable enough for real trading?" "Is the historical data accurate?" "What if I need execution later?"

---

## Customer Language

**How they describe the problem:**
- "I want to test a strategy but wiring the data and simulation takes forever"
- "I have an idea, I just want to see if it works on historical data"
- "Setting up the infra is slower than actually thinking about the strategy"

**How they describe us:**
- "I described a strategy and it ran a backtest — that's insane"
- "Finally, real-time crypto data that just works with Claude"
- "HFT-grade data without building infrastructure"

**Words to use:**
- AI-native, backtest, live validation, strategy, plug-and-play, real-time, MCP, HFT-grade, paper trading

**Words to avoid:**
- Complex, enterprise, proprietary, centralized (when not the value prop), "just another data provider"

---

## Brand Voice

**Tone:** Technical/engineer-focused, direct, no hype — let the demo do the work

**Style:** Show, don't tell. Lead with working demos and concrete outputs (backtest metrics, P&L curves) before explaining how it works.

**Personality:** Builder-focused, transparent, performance-obsessed, accessible to solo devs

---

## Proof Points

**Metrics:** (Building as product matures)
- Latency benchmarks vs. direct APIs
- Historical data accuracy and depth
- Exchange coverage
- Backtest execution time

**Customers/Testimonials:** (Collecting via early outreach — 10–20 algo/AI trader interviews in progress)

**Value themes:**
| Theme | Proof Point |
|-------|------------|
| Instant backtesting | Natural language → metrics in seconds |
| Low-latency performance | C++ HFT-grade backend |
| Multi-exchange coverage | Binance, Kraken, Coinmarketcap, etc. |
| AI-native integration | MCP protocol, works with Claude natively |
| Zero infra overhead | Plug-and-play, no wiring required |
| Safe to start | Paper trading / live sim before real execution |

---

## Goals

**Primary goal:** Validate product-market fit with algo/AI traders — confirm they'll pay for plug-and-play strategy validation

**Key conversion action:** User connects, runs a backtest on a real strategy, returns within a week

**Current stage:** Idea validation + smallest monetizable slice (weeks 2–4)

**Iteration path:**
1. Validate: interviews + demo flows with 10–20 users
2. Build core slice: MCP data + historical layer + backtest orchestration
3. Launch free tier, collect feedback, identify paid conversion triggers
4. Add execution integrations (Freqtrade, CCXT) as BYO-keys, BYO-execution
5. Introduce team plans and "strategy validation as a service" for small funds
