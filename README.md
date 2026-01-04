# BlockFi Vault - Advanced DeFi Protocol

![BlockFi Vault Banner](https://img.shields.io/badge/DeFi-Institutional-64FFDA)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-primary)
![React](https://img.shields.io/badge/React-19.0-blue)

BlockFi Vault is a production-grade decentralized finance (DeFi) protocol designed for secure lending, borrowing, and staking. Built with a focus on institutional aesthetics and robust smart contract security.

## 🚀 Key Features

- **Multi-Asset Vaults**: Deposit ETH, USDC, or WBTC to earn variable yields.
- **Over-Collateralized Loans**: Access liquidity instantly by supplying assets as collateral.
- **Governance Staking**: Stake BVF tokens to earn protocol rewards and participate in the DAO.
- **Institutional Dashboard**: A premium, glassmorphic UI built with Tailwind CSS v4 and Recharts.
- **Security-First Architecture**: Powered by OpenZeppelin's audited contract libraries.

## 🛠 Tech Stack

- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin.
- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, Framer Motion, Ethers.js.
- **DevOps**: Docker, Nginx.

## 📂 Project Structure

```text
├── contracts/        # Smart contract development (Hardhat)
│   ├── contracts/    # Solidity source files
│   ├── scripts/      # Deployment and interaction scripts
│   └── test/         # Comprehensive test suite
├── frontend/         # React application (Vite)
│   ├── src/          # Source code with premium UI tokens
│   └── Dockerfile    # Production containerization
└── docker-compose.yml # Full stack orchestration
```

## 🏁 Getting Started

### Prerequisites
- Node.js v18+
- Docker (optional for production)

### Local Development

1. **Smart Contracts**:
   ```bash
   cd contracts
   npm install
   npx hardhat compile
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🛡 Security

The protocol implements:
- **Reentrancy Guards**: Protection against recursive calls.
- **Pause Mechanisms**: Emergency circuit breakers.
- **Ownership Control**: Fine-grained access management.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
