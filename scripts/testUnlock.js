import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [relayer] = await ethers.getSigners();

  console.log("Using relayer:", relayer.address);

  const bridgeLockAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const bridgeLock = await ethers.getContractAt(
    "BridgeLock",
    bridgeLockAddress,
    relayer
  );

  const amount = ethers.parseEther("50");

  const burnHash = ethers.keccak256(
    ethers.toUtf8Bytes("burnTxHash123")
  );

  console.log("Unlocking tokens on Chain A...");

  const tx = await bridgeLock.unlock(
    relayer.address,
    amount,
    burnHash
  );

  await tx.wait();

  console.log("✅ Tokens unlocked successfully!");
}

main().catch(console.error);
