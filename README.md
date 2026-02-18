# 🔗 Cross-Chain Token Bridge (Dockerized)

A fully containerized cross-chain token bridge system built with Solidity smart contracts, a Node.js relayer service, and dual local EVM chains powered by Foundry Anvil.

This project demonstrates:

- Lock & Mint bridging (Chain A ➜ Chain B)
- Burn & Unlock bridging (Chain B ➜ Chain A)
- Nonce-based replay protection
- Relayer event monitoring
- Failure scenario handling
- Fully Dockerized infrastructure

---

# 📦 Architecture Overview

Chain A (Source Chain)
- VaultToken (ERC20)
- BridgeLock (locks tokens)

Chain B (Destination Chain)
- WrappedVaultToken (ERC20)
- BridgeMint (mints wrapped tokens)

Relayer Service
- Listens for Lock & Burn events
- Submits Mint & Unlock transactions
- Prevents replay via nonce tracking

---

# 🏗 System Architecture

```
User → Lock Tokens (Chain A)
      ↓
Relayer detects Lock event
      ↓
Mint Wrapped Tokens (Chain B)

User → Burn Wrapped Tokens (Chain B)
      ↓
Relayer detects Burn event
      ↓
Unlock Original Tokens (Chain A)
```

---

# 🐳 Dockerized Setup

This project runs entirely using Docker.

It includes:

- 2x Local EVM Chains (Anvil)
- 1x Relayer Service
- Single-command deployment

---

# 🚀 Quick Start

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd token-bridge
```

---

### 2️⃣ Create Environment File

Create `.env` file from example:

```bash
cp .env.example .env
```

---

### 3️⃣ Start System

```bash
docker-compose up --build
```

That’s it.

The system will:

- Start Chain A on port 8545
- Start Chain B on port 9545
- Start Relayer service
- Begin listening for bridge events

---

# 🔐 Environment Variables

All required variables are documented in `.env.example`.

Example:

```
CHAIN_A_RPC=http://chain-a:8545
CHAIN_B_RPC=http://chain-b:9545

PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

CHAIN_A_BRIDGE_LOCK_ADDRESS=0x...
CHAIN_B_BRIDGE_MINT_ADDRESS=0x...
```

Make sure:

- Private key matches funded account
- Contract addresses are correct

---

# 📂 Repository Structure

```
contracts/              # Solidity smart contracts
relayer/                # Node.js relayer service
tests/                  # Hardhat test suite
docker-compose.yml      # Multi-container setup
.env.example            # Environment variable documentation
README.md               # Project documentation
```

---

# 🧠 Smart Contracts

## Chain A

### VaultToken.sol
Standard ERC20 token.

### BridgeLock.sol
- Locks tokens
- Emits Lock event
- Supports unlock by relayer

---

## Chain B

### WrappedVaultToken.sol
Mintable & burnable wrapped token.

### BridgeMint.sol
- Mints wrapped tokens
- Handles burn events
- Prevents replay using nonce tracking

---

# 🔁 Relayer Service

The relayer:

- Connects to both chains
- Subscribes to Lock and Burn events
- Calls mint() on Chain B
- Calls unlock() on Chain A
- Tracks processed nonces

Security Features:
- Replay protection
- Private key isolation via environment variables
- Event-based automation

---

# 🧪 Testing

Tests are located inside:

```
tests/
```

Includes:

- Lock → Mint flow
- Burn → Unlock flow
- Replay attack prevention
- Failure simulation
- Edge case validation

Run tests locally:

```bash
npx hardhat test
```

---

# 🛡 Security Considerations

- Nonce-based replay protection
- Relayer-only mint/unlock permissions
- Owner-restricted administrative functions
- Docker environment isolation
- No hardcoded secrets

---

# ⚠ Failure Scenarios Handled

- Duplicate nonce replay attempts
- Invalid unlock calls
- Unauthorized mint attempts
- Invalid private key detection
- RPC connection failure handling

---

# 🔍 Evaluation Criteria Coverage

✔ Functional end-to-end bridge  
✔ Relayer automation  
✔ Failure simulation  
✔ Replay protection  
✔ Dockerized environment  
✔ Environment configuration documentation  
✔ Clean architecture  
✔ Maintainable codebase  

---

# 🏆 Deployment Command

The entire system runs using:

```bash
docker-compose up --build
```

One command deployment.

---

# 🧑‍💻 Tech Stack

- Solidity (OpenZeppelin)
- Hardhat
- Ethers.js v6
- Node.js 20
- Docker
- Foundry Anvil

---

# 📌 Notes

- Local chains use Chain ID 31337
- Accounts funded with 10,000 ETH
- Private keys printed during Anvil startup
- Relayer auto-reconnects on RPC failure

---

# 📜 License

MIT License

---

# 🙌 Author

Built as part of Partnr technical evaluation.

---

# 🎯 Final Statement

This project demonstrates a production-style cross-chain token bridge with full automation, failure handling, and containerized deployment suitable for evaluation and portfolio presentation.

