import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const {
  CHAIN_A_RPC,
  CHAIN_B_RPC,
  PRIVATE_KEY,
  BRIDGE_LOCK_ADDRESS,
  BRIDGE_MINT_ADDRESS
} = process.env;

const providerA = new ethers.JsonRpcProvider(CHAIN_A_RPC);
const providerB = new ethers.JsonRpcProvider(CHAIN_B_RPC);

const walletA = new ethers.Wallet(PRIVATE_KEY, providerA);
const walletB = new ethers.Wallet(PRIVATE_KEY, providerB);

const bridgeLockAbi = [
  "event Locked(address indexed user, uint256 amount, bytes32 nonce)",
  "function unlock(address user, uint256 amount, bytes32 nonce)"
];

const bridgeMintAbi = [
  "function mint(address user, uint256 amount, bytes32 nonce)",
  "event Burned(address indexed user, uint256 amount, bytes32 nonce)"
];

const bridgeLock = new ethers.Contract(
  BRIDGE_LOCK_ADDRESS,
  bridgeLockAbi,
  walletA
);

const bridgeMint = new ethers.Contract(
  BRIDGE_MINT_ADDRESS,
  bridgeMintAbi,
  walletB
);

console.log("Relayer started...");

bridgeLock.on("Locked", async (user, amount, nonce) => {
  console.log("Lock detected → Minting on Chain B");

  const tx = await bridgeMint.mint(user, amount, nonce);
  await tx.wait();

  console.log("Mint complete.");
});

bridgeMint.on("Burned", async (user, amount, nonce) => {
  console.log("Burn detected → Unlocking on Chain A");

  const tx = await bridgeLock.unlock(user, amount, nonce);
  await tx.wait();

  console.log("Unlock complete.");
});
