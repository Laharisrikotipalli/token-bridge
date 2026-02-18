import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy WrappedVaultToken
  const WrappedVaultToken = await ethers.getContractFactory("WrappedVaultToken");
  const wrappedToken = await WrappedVaultToken.deploy(deployer.address);

  await wrappedToken.waitForDeployment();

  console.log("WrappedVaultToken deployed at:", await wrappedToken.getAddress());

  // 2️⃣ Deploy BridgeMint
  const BridgeMint = await ethers.getContractFactory("BridgeMint");
  const bridgeMint = await BridgeMint.deploy(
    await wrappedToken.getAddress(),
    deployer.address
  );

  await bridgeMint.waitForDeployment();

  console.log("BridgeMint deployed at:", await bridgeMint.getAddress());

  // 3️⃣ Set BridgeMint inside token
  const tx = await wrappedToken.setBridgeMint(
    await bridgeMint.getAddress()
  );
  await tx.wait();

  console.log("BridgeMint address set in token ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
