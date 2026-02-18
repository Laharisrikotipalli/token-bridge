import { expect } from "chai";
import { ethers } from "hardhat";

describe("Unauthorized Access Protection", function () {
  let wrappedToken, bridgeMint, owner, attacker;

  beforeEach(async function () {
    [owner, attacker] = await ethers.getSigners();

    const WrappedVaultToken = await ethers.getContractFactory("WrappedVaultToken");
    wrappedToken = await WrappedVaultToken.deploy(owner.address);
    await wrappedToken.waitForDeployment();

    const BridgeMint = await ethers.getContractFactory("BridgeMint");
    bridgeMint = await BridgeMint.deploy(await wrappedToken.getAddress());
    await bridgeMint.waitForDeployment();

    await wrappedToken.setBridgeMint(await bridgeMint.getAddress());
  });

  it("Non-owner cannot mint directly on token", async function () {
    await expect(
      wrappedToken.connect(attacker).mint(attacker.address, 100)
    ).to.be.reverted;
  });

  it("Only bridge can mint wrapped tokens", async function () {
    const amount = ethers.parseEther("10");
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    await expect(
      bridgeMint.connect(attacker).mint(attacker.address, amount, nonce)
    ).to.be.reverted;
  });
});
