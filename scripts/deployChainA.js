const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy VaultToken
  const VaultToken = await ethers.getContractFactory("VaultToken");
  const vaultToken = await VaultToken.deploy();
  await vaultToken.waitForDeployment();

  console.log("VaultToken deployed at:", await vaultToken.getAddress());

  // Use deployer as temporary relayer for now
  const relayerAddress = deployer.address;

  // Deploy BridgeLock
  const BridgeLock = await ethers.getContractFactory("BridgeLock");
  const bridgeLock = await BridgeLock.deploy(
    await vaultToken.getAddress(),
    relayerAddress
  );
  await bridgeLock.waitForDeployment();

  console.log("BridgeLock deployed at:", await bridgeLock.getAddress());

  // Deploy GovernanceEmergency
  const GovernanceEmergency = await ethers.getContractFactory("GovernanceEmergency");
  const governanceEmergency = await GovernanceEmergency.deploy(
    relayerAddress,
    await bridgeLock.getAddress()
  );
  await governanceEmergency.waitForDeployment();

  console.log("GovernanceEmergency deployed at:", await governanceEmergency.getAddress());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
