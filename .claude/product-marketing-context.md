# Product Marketing Context: MCP Market Data

*Last updated: 2026-03-02*

## Product Overview

**One-liner:** HFT-grade data for AI traders — real-time crypto market data via MCP.

**What it does:** MCP Market Data is an open-source MCP server that aggregates real-time cryptocurrency market data from multiple exchanges (Binance, Kraken, Coinmarketcap, etc.) and makes it natively accessible to AI agents and assistants. Built with a C++ backend optimized for low-latency HFT-grade performance.

**Product category:** Developer tool / AI infrastructure

**Product type:** Open-source MCP server

**Business model:** Open-source (potential future monetization via proprietary exchange, but not the current focus)

## Target Audience

**Target users:**
- AI developers building crypto applications
- Crypto traders integrating AI into their workflows
- Algorithmic traders building automated systems
- Developers building AI trading bots

**Decision-makers:** Individual developers, small trading teams, AI engineers

**Primary use case:** Integrating real-time, aggregated crypto market data into AI agents without custom API integration overhead

**Jobs to be done:**
- Get aggregated data across multiple exchanges in real-time
- Eliminate friction when connecting crypto data to AI models
- Build autonomous trading agents that can access live market data
- Create AI-powered market analysis and research tools

**Use cases:**
- Trading agents that monitor prices, send alerts, and execute trades
- Crypto research assistants powered by Claude or other MCP-compatible AI
- Real-time market opportunity notification agents
- Algorithmic trading bots with AI decision-making

## Problems & Pain Points

**Core problems:**
1. Aggregating data across multiple exchanges is complex and high-latency
2. Integrating crypto data into AI applications requires custom work (API keys, authentication, wrappers)

**Why alternatives fall short:**
- Direct exchange APIs: Requires managing multiple integrations, authentication, rate limits
- Traditional crypto data providers: Not AI-native, require custom connectors
- Building custom integrations: Time-consuming, maintenance overhead

**What it costs them:**
- Development time building integrations
- Latency issues affecting real-time trading decisions
- Missing data from multiple sources
- Complexity in deployment and maintenance

## Differentiation

**Key differentiators:**
- **Multi-exchange aggregation:** Real-time data from Binance, Kraken, Coinmarketcap, and more
- **HFT-grade backend:** C++ implementation optimized for low-latency performance
- **AI-native protocol:** MCP means zero-friction integration with Claude and any MCP-compatible AI
- **Open-source:** No vendor lock-in, transparent, community-driven

**How we do it differently:**
- Other crypto data providers aren't designed for AI integration
- Other MCP servers don't offer multi-exchange crypto data aggregation
- Building custom integrations requires engineering overhead; MCP is plug-and-play

**Why customers choose us:**
- Fastest path from "I want crypto data in my AI" to having it working
- HFT-grade performance you'd normally need to build yourself
- Works across any MCP-compatible AI (Claude, others), not locked to one platform
- Open-source means transparency and community contributions

## Switching Dynamics

**Push:** Frustration with slow integrations, multiple API keys, latency issues, missing exchange coverage

**Pull:** One-line MCP connection, HFT-grade speed, multi-exchange data, works with Claude natively

**Habit:** Developers are used to writing custom integrations or using separate APIs

**Anxiety:** "Will this be reliable enough for real trading?" "Will it work with my AI model?"

## Customer Language

**How they describe the problem:**
- "I need data from multiple exchanges but it's a pain to integrate"
- "I want to build a trading agent but connecting to market data is the hardest part"
- "Setting up all these APIs is slower than actually building the AI logic"

**How they describe us:**
- "Finally, real-time crypto data that just works with Claude"
- "This is the fastest way to get my trading bot live"
- "HFT-grade data without building infrastructure"

**Words to use:**
- AI-native, integration, real-time, aggregation, low-latency, open-source, MCP, trading agents

**Words to avoid:**
- Complex, enterprise, proprietary, centralized (when it's not the value prop)

## Brand Voice

**Tone:** Technical/engineer-focused, casual, friendly, simple (context-dependent)

**Style:** Direct and practical; explain things clearly without overcomplicating; friendly when appropriate

**Personality:** Performant, transparent, builder-focused, accessible

## Proof Points

**Metrics:** (Coming as project matures)
- Latency benchmarks vs. direct APIs
- Exchange coverage / data accuracy
- Uptime / reliability stats

**Customers/Testimonials:** (No early users yet — focus on validating idea first)

**Value themes:**
| Theme | Proof Point |
|-------|------------|
| Low-latency performance | C++ HFT-grade backend |
| Multi-exchange coverage | Binance, Kraken, Coinmarketcap, etc. |
| AI-native integration | MCP protocol, works across any MCP-compatible AI |
| Zero friction | One-line connection, no custom integrations needed |

## Goals

**Primary goal:** Validate the idea with early users (AI developers and traders building crypto AI applications)

**Key conversion action:** Get developers to connect and use MCP Market Data in a real project

**Current stage:** Open-source launch phase, validating product-market fit
