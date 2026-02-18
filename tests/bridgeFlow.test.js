import { expect } from "chai";
import { ethers } from "hardhat";

describe("Cross-Chain Bridge - End to End", function () {
  let vaultToken, bridgeLock;
  let wrappedToken, bridgeMint;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // --- Deploy Chain A ---
    const VaultToken = await ethers.getContractFactory("VaultToken");
    vaultToken = await VaultToken.deploy();
    await vaultToken.waitForDeployment();

    const BridgeLock = await ethers.getContractFactory("BridgeLock");
    bridgeLock = await BridgeLock.deploy(await vaultToken.getAddress());
    await bridgeLock.waitForDeployment();

    // Mint initial tokens to user
    await vaultToken.mint(user.address, ethers.parseEther("1000"));

    // --- Deploy Chain B ---
    const WrappedVaultToken = await ethers.getContractFactory("WrappedVaultToken");
    wrappedToken = await WrappedVaultToken.deploy(owner.address);
    await wrappedToken.waitForDeployment();

    const BridgeMint = await ethers.getContractFactory("BridgeMint");
    bridgeMint = await BridgeMint.deploy(await wrappedToken.getAddress());
    await bridgeMint.waitForDeployment();

    // Set bridge address in wrapped token
    await wrappedToken.setBridgeMint(await bridgeMint.getAddress());
  });

  it("Lock → Mint → Burn → Unlock flow works", async function () {
    const amount = ethers.parseEther("100");
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    // User approves
    await vaultToken.connect(user).approve(
      await bridgeLock.getAddress(),
      amount
    );

    // Lock tokens on Chain A
    await bridgeLock.connect(user).lock(amount, nonce);

    // Mint wrapped tokens on Chain B
    await bridgeMint.mint(user.address, amount, nonce);

    const wrappedBalance = await wrappedToken.balanceOf(user.address);
    expect(wrappedBalance).to.equal(amount);

    // Burn wrapped tokens
    const burnNonce = ethers.hexlify(ethers.randomBytes(32));
    await bridgeMint.connect(user).burn(amount, burnNonce);

    // Unlock original tokens
    await bridgeLock.unlock(user.address, amount, burnNonce);

    const finalBalance = await vaultToken.balanceOf(user.address);
    expect(finalBalance).to.equal(ethers.parseEther("1000"));
  });
});
