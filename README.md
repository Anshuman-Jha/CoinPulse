<div align="center">
  <br />
        <div>
      <img src="public/Readme.png" />
    </div>
  <br />

  <div>
<img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logo=Next.js&logoColor=white" />
<img src="https://img.shields.io/badge/-Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white" />
<img src="https://img.shields.io/badge/-Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/-shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
<img src="https://img.shields.io/badge/-CoinGecko-06D6A0?style=for-the-badge&logo=coingecko&logoColor=white" />


  </div>

  <h3 align="center">CoinPulse — Analytics Dashboard for Web3</h3>


## <a name="introduction">✨ Introduction</a>

Experience the pulse of the crypto market in real-time. **CoinPulse** isn't just a dashboard; it's your high-frequency command center for Web3 intelligence. Built on the bleeding edge with **Next.js 16**, **Tailwind v4**, and **CoinGecko's Pro API**, we deliver sub-second market updates, live orderbook streams, and surgical-grade charting powered by TradingView. Whether you're tracking global dominance or hunting the next moonshot, CoinPulse gives you the unfair advantage of speed, clarity, and precision.

### System Architecture

```mermaid
graph TD
    User[User / Client] -->|Visits Page| NextJS[Next.js App Router]
    
    subgraph Frontend
        NextJS -->|Renders| HomePage[Home Page]
        NextJS -->|Renders| CoinPage[Coin Details Page]
        NextJS -->|Renders| Search[Search Component]
    end
    
    subgraph Server_Actions [Server Actions / Lib]
        HomePage -->|Fetches Data| Actions[coingecko.actions.ts]
        CoinPage -->|Fetches Data| Actions
        Search -->|Queries| Actions
    end
    
    subgraph External_API [External Services]
        Actions -->|HTTP Requests| CoinGecko[CoinGecko API]
        CoinGecko -->|JSON Response| Actions
    end

    classDef client fill:#1a1b26,stroke:#ff007f,stroke-width:2px,color:#fff;
    classDef server fill:#1a1b26,stroke:#7aa2f7,stroke-width:2px,color:#fff;
    classDef external fill:#1a1b26,stroke:#9ece6a,stroke-width:2px,color:#fff;

    class User,NextJS client;
    class Actions,HomePage,CoinPage,Search server;
    class CoinGecko external;
```
## <a name="features">🔋 Features</a>

**🚀 Mission Control Dashboard**
Instant access to global market health. Track Market Cap, Dominance, and Trending Coins in real-time.

**💎 Token Explorer**
Filter, sort, and discover hidden gems among thousands of assets with our high-performance table.

**⚡ Live Market Pulse**
Witness the market move dynamically. Real-time price updates and live orderbook streams via WebSockets—no refreshing needed.

**📈 Pro-Grade Charting**
Technical analysis made beautiful. Interactive TradingView charts with multi-timeframe OHLCV data.

**� Smart Currency Converter**
Seamlessly calculate value across dozens of fiat and crypto currencies instantly.

**🔍 Universal Search**
Find any asset in milliseconds with our optimized global search.

**🏦 Deep Market Analysis**
Explore exchanges, trading pairs, and tickers to understand the full liquidity landscape.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js]
- **[TypeScript]
- **[Tailwind CSS]
- **[Shadcn/ui]
- **[CoinGecko API]
TradingView Lightweight Charts

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone  https://github.com/Anshuman-Jha/CoinPulse.git
cd CoinPulse
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3
COINGECKO_API_KEY=

NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=
NEXT_PUBLIC_COINGECKO_API_KEY=
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.



