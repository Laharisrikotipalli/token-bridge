const { ethers } = require("hardhat");

async function main() {
  const [user] = await ethers.getSigners();

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const bridgeLockAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const VaultToken = await ethers.getContractAt("VaultToken", tokenAddress);
  const BridgeLock = await ethers.getContractAt("BridgeLock", bridgeLockAddress);

  const amount = ethers.parseEther("100");

  console.log("Approving tokens...");
  await (await VaultToken.approve(bridgeLockAddress, amount)).wait();

  console.log("Locking tokens...");
  const tx = await BridgeLock.lock(amount);
  await tx.wait();

  console.log("✅ Tokens locked successfully!");
}

main();
