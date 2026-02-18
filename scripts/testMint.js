import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [relayer] = await ethers.getSigners();

  const bridgeMintAddress = "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da";

  const bridgeMint = await ethers.getContractAt(
    "BridgeMint",
    bridgeMintAddress,
    relayer
  );

  const amount = ethers.parseEther("100");

  const nonce = ethers.hexlify(ethers.randomBytes(32));

  console.log("Minting...");
  console.log("To:", relayer.address);
  console.log("Nonce:", nonce);

  const tx = await bridgeMint.mint(
    relayer.address,
    amount,
    nonce
  );

  await tx.wait();

  console.log("✅ Wrapped tokens minted successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
