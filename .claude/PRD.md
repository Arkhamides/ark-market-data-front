# Product Requirements Document: MCP Market Data

*Version: 0.1 — Last updated: 2026-03-22*
*Status: Pre-validation / Smallest Monetizable Slice*

---

## 1. Problem Statement

Algo traders and AI developers who want to test crypto strategies face a two-part tax before they can validate a single idea:

1. **Data infrastructure tax** — aggregating real-time and historical data across exchanges requires custom integrations, API key management, rate-limit handling, and latency tuning.
2. **Simulation infrastructure tax** — turning a strategy spec into a runnable backtest requires simulation engines, data pipelines, and metric calculation — weeks of engineering.

Most of the time is spent on plumbing, not strategy. Ideas die before they're validated.

**Target persona:** Solo algo/quant developers and AI developers who have strategy ideas but don't want to build data + sim infra from scratch — and will pay when it's plug-and-play.

---

## 2. Vision

> "Describe a strategy in chat, get instant backtests on historical data and live forward tests with HFT-grade feeds."

The full AI-native loop:
```
Natural language strategy spec
  → AI generates rules/code
    → Backtest on historical data
      → Metrics (P&L, drawdown, win rate)
        → Paper/live forward test
```

No custom connectors. No data pipelines. No simulation boilerplate.

---

## 3. Goals

### Validation Goals (Weeks 1–4)
- Interview 10–20 algo/AI traders to confirm: (a) they hate wiring infra, (b) they'd pay for plug-and-play
- Build 2–3 concrete demo flows to show in communities and calls
- Identify the exact point where the demo converts a skeptic

### Product Goals (Weeks 4–12)
- Ship the smallest monetizable slice: real-time data + historical layer + backtest orchestration
- Launch free tier and collect usage data
- Get 5–10 users who return within a week after their first backtest
- Get 2–3 paid conversions triggered by hitting free tier limits

### Business Goals (Months 3–6)
- Establish repeatable paid conversion path
- Identify which limits drive upgrades (history depth, pairs, throughput, concurrent tests)
- Validate team/desk use case before building team features

---

## 4. Scope: Core Slice (MVP)

### 4.1 MCP Market Data Layer

**In scope:**
- Real-time multi-exchange data via MCP (Binance, Kraken, Coinmarketcap — existing)
- Historical OHLCV data: start with 1–3 major pairs (BTC/USDT, ETH/USDT), 1m and 5m bars, minimum 6 months depth
- MCP tools exposed: `get_price`, `get_ohlcv`, `get_orderbook`, `get_ticker`
- Authenticated rate-limited API access (for paid tiers)

**Out of scope for MVP:**
- Deep historical archives (>1 year) — Tier 1+ feature
- Tick data / order flow — future
- Derivatives / futures data — post-MVP

### 4.2 Backtest Orchestration Layer

**In scope:**
- Accept a strategy specification from an LLM (either structured JSON rules or generated Python/pseudo-code)
- Run backtest against historical OHLCV data
- Surface core metrics: P&L, max drawdown, win rate, Sharpe ratio, number of trades
- Store backtest run results per session (not long-term on free tier)
- MCP tool exposed: `run_backtest(strategy_spec, pair, timeframe, date_range) → metrics`

**Out of scope for MVP:**
- Portfolio-level backtesting (multiple strategies simultaneously)
- Transaction cost modeling — add in v1.1
- Walk-forward optimization — post-MVP
- Strategy code execution sandbox (start with rule-based specs; full code execution is a security scope item)

### 4.3 Live Forward Testing (Paper Trading)

**In scope:**
- Paper trading mode: simulate strategy execution against live real-time feed
- Track paper P&L, positions, signals in session
- MCP tool exposed: `start_paper_test(strategy_spec, pair) → live_session_id`
- Basic session status: `get_paper_test_status(session_id) → current metrics`

**Out of scope for MVP:**
- Persistent paper trading across sessions (free tier) — Tier 1+ feature
- Real execution / broker integrations (BYO-execution model; add post-MVP)
- Multi-strategy paper portfolios

### 4.4 AI Orchestration (Chat Interface)

**In scope:**
- Claude-powered chatbot (existing MCP-aware chatbot infrastructure)
- Prompt templates for: "describe a strategy" → structured spec extraction
- Display backtest metrics inline in chat (P&L, drawdown, win rate, Sharpe)
- Display paper test status inline in chat

**Out of scope for MVP:**
- Automatic strategy code generation (LLM generates rules, not executable code — safer and faster to ship)
- Multi-turn strategy refinement loop — v1.1
- Strategy library / saved strategies on free tier

---

## 5. Non-Goals

- Real trade execution (users bring their own broker/bot; we do not touch live orders)
- Financial advice or strategy recommendations — we surface metrics, not opinions
- Derivatives, options, futures data — out of scope for initial launch
- White-label or enterprise on-prem — post Series A problem

---

## 6. User Stories

### Backtest Flow
```
As an algo developer,
I want to describe a strategy in chat and get backtest metrics,
So that I can validate ideas without wiring data + sim infrastructure.
```

**Acceptance criteria:**
- User types a strategy description in natural language
- Claude extracts a structured spec (entry/exit conditions, pair, timeframe)
- Backtest runs against historical OHLCV data
- Metrics returned: P&L %, max drawdown, win rate, Sharpe, # trades
- Total time from message to metrics: <10 seconds for 6-month backtest on 5m bars

### Live Forward Test Flow
```
As a trader,
I want to paper-test my strategy on live data before risking capital,
So that I can see real-time performance without execution risk.
```

**Acceptance criteria:**
- User starts a paper test from chat
- Session tracks simulated entries/exits on live feed
- User can query current paper P&L and open positions at any time
- Session persists for the duration of the browser/MCP session

### Free Tier Limit Hit
```
As a free user who hit a limit,
I want to understand what I'd get on paid,
So that I can decide whether to upgrade.
```

**Acceptance criteria:**
- Clear inline message when hitting limits (pairs, history depth, concurrent tests)
- One-click path to upgrade page
- Upgrade page shows concrete example of what unlocked (e.g., "12 months BTC history instead of 1 month")

---

## 7. Pricing & Access Tiers

| Feature | Free (Tier 0) | Indie (Tier 1) | Pro (Tier 2) |
|---------|--------------|----------------|--------------|
| Pairs | 2 (BTC, ETH) | Up to 20 | Unlimited |
| Historical depth | 1 month | 12 months | 36+ months |
| Real-time rate limit | Low | Medium | High |
| Concurrent paper tests | 1 | 5 | Unlimited |
| Backtest run storage | Session only | 30 days | 1 year |
| Support | Community | Email | Priority |
| Price | Free | 29–99 €/mo | Custom |

**Optional:** "Backtest credits" — pay-per-use for users who don't want a subscription (e.g., 10 credits = 10 full backtests on Tier 1 data).

---

## 8. Technical Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                   Chat Interface                     │
│         (Claude MCP-aware chatbot, Svelte)          │
└─────────────────┬───────────────────────────────────┘
                  │ MCP protocol
┌─────────────────▼───────────────────────────────────┐
│              MCP Server Layer                        │
│  Tools: get_price, get_ohlcv, run_backtest,         │
│         start_paper_test, get_paper_test_status      │
└────────┬──────────────────────┬──────────────────────┘
         │                      │
┌────────▼────────┐   ┌─────────▼────────────────────┐
│   C++ Data      │   │   Backtest / Sim Engine       │
│   Backend       │   │   (strategy spec → metrics)   │
│   (real-time)   │   │                               │
└────────┬────────┘   └─────────┬────────────────────┘
         │                      │
┌────────▼──────────────────────▼────────────────────┐
│             Historical Data Store                   │
│   (OHLCV: BTC, ETH — 1m/5m bars, 6mo+ depth)      │
└─────────────────────────────────────────────────────┘
```

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backtest engine | Custom (simple rule-based) | Fastest to ship; avoid Backtrader/QuantLib complexity for MVP |
| Strategy spec format | Structured JSON rules | Safer than code execution; LLM can generate reliably |
| Historical data source | Self-collected via exchange APIs | Control over depth and accuracy; can switch to provider later |
| Auth / rate limiting | API key per user | Simple, tier-enforceable |
| Execution | Not included (BYO) | Eliminates regulatory and infra complexity at launch |

---

## 9. Metrics & Success Criteria

### Week 4
- [ ] Demo flow built and shown to 10+ algo/AI traders
- [ ] At least 3 users say "I'd pay for this"
- [ ] Identified top 2–3 blockers or confusion points in demo

### Week 8
- [ ] 5–10 users have connected and run 3+ backtests each
- [ ] At least 1 user returns unprompted within a week of first use
- [ ] Watching: where users get stuck (MCP setup, strategy spec, metric interpretation)
- [ ] Watching: what they request most (more history, more pairs, more metrics, auto-code gen)

### Month 3
- [ ] 2–3 paid conversions
- [ ] Clear understanding of which limit drives upgrade (depth vs. pairs vs. throughput)
- [ ] Retention: >50% of active users return in week 2

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Users want code execution, not rule-based specs | Medium | Ship rule-based MVP; add code sandbox in v1.1 if validated |
| Historical data quality / gaps | Medium | Start with top 2 pairs from reliable exchange; validate accuracy early |
| MCP setup friction kills onboarding | High | Build a guided setup flow; offer "I'll set you up for free" concierge for first users |
| Strategy spec extraction is unreliable | Medium | Prompt-engineer heavily; add structured input form as fallback |
| Backtest metrics don't match user's own calculations | Medium | Be transparent about assumptions (no slippage, no fees in MVP); add transaction cost model in v1.1 |
| Users want execution immediately | Medium | Position paper trading as the value; execution is BYO when they're ready |

---

## 11. Iteration Roadmap

### Phase 0 — Validation (Weeks 1–4)
- Interview 10–20 traders
- Build 2–3 demo flows (no backtest engine yet — fake it if needed)
- Show demos in communities (r/algotrading, discords)

### Phase 1 — Core Slice (Weeks 4–10)
- Historical data layer (BTC, ETH, 6mo, 1m/5m)
- Rule-based backtest engine
- MCP tools: `run_backtest`, `start_paper_test`, `get_paper_test_status`
- Free tier launch

### Phase 2 — Growth (Months 3–4)
- Paid tier: more pairs, deeper history, persistent sessions
- Onboarding flow improvements based on Phase 1 feedback
- Backtest credits pay-per-use option

### Phase 3 — Expansion (Months 5–6)
- Execution integrations (Freqtrade, CCXT) — BYO-keys, BYO-execution
- Strategy library (save, share, fork)
- Team plans (shared dashboard, shared strategies)

### Phase 4 — Up-market (Month 6+)
- "Strategy validation as a service" for small funds
- Custom backtest suites, white-glove onboarding
- Private instances for desks
