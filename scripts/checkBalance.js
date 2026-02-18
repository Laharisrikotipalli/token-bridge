import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [user] = await ethers.getSigners();

  const tokenAddress = "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0";

  const token = await ethers.getContractAt(
    "WrappedVaultToken",
    tokenAddress,
    user
  );

  console.log("Checking balance of:", user.address);

  const balance = await token.balanceOf(user.address);

  console.log("User balance:", ethers.formatEther(balance));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
