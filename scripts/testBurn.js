import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [user] = await ethers.getSigners();

  console.log("Using user:", user.address);

  const bridgeMintAddress = "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a";

  const bridgeMint = await ethers.getContractAt(
    "BridgeMint",
    bridgeMintAddress,
    user
  );

  const amount = ethers.parseEther("50");

  console.log("Burning...");
  const tx = await bridgeMint.burn(amount);

  await tx.wait();

  console.log("✅ Burn successful!");
}

main().catch(console.error);
