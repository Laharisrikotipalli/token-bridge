import { expect } from "chai";
import { ethers } from "hardhat";

describe("Unlock Protection", function () {
  let vaultToken, bridgeLock, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const VaultToken = await ethers.getContractFactory("VaultToken");
    vaultToken = await VaultToken.deploy();
    await vaultToken.waitForDeployment();

    const BridgeLock = await ethers.getContractFactory("BridgeLock");
    bridgeLock = await BridgeLock.deploy(await vaultToken.getAddress());
    await bridgeLock.waitForDeployment();

    await vaultToken.mint(user.address, ethers.parseEther("100"));
  });

  it("Should not unlock without burn event", async function () {
    const amount = ethers.parseEther("10");
    const fakeNonce = ethers.hexlify(ethers.randomBytes(32));

    await expect(
      bridgeLock.unlock(user.address, amount, fakeNonce)
    ).to.be.reverted;
  });
});
