import { expect } from "chai";
import { ethers } from "hardhat";

describe("Replay Protection", function () {
  let wrappedToken, bridgeMint, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const WrappedVaultToken = await ethers.getContractFactory("WrappedVaultToken");
    wrappedToken = await WrappedVaultToken.deploy(owner.address);
    await wrappedToken.waitForDeployment();

    const BridgeMint = await ethers.getContractFactory("BridgeMint");
    bridgeMint = await BridgeMint.deploy(await wrappedToken.getAddress());
    await bridgeMint.waitForDeployment();

    await wrappedToken.setBridgeMint(await bridgeMint.getAddress());
  });

  it("Should prevent double mint with same nonce", async function () {
    const amount = ethers.parseEther("50");
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    await bridgeMint.mint(user.address, amount, nonce);

    await expect(
      bridgeMint.mint(user.address, amount, nonce)
    ).to.be.revertedWith("Already processed");
  });
});
