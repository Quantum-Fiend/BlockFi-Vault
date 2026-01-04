import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("BlockFiVault", function () {
    async function deployVaultFixture() {
        const [owner, user1, user2] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        const mockUSDC = await MockToken.deploy("USD Coin", "USDC");
        const mockETH = await MockToken.deploy("Ethereum", "ETH");

        const BlockFiVault = await ethers.getContractFactory("BlockFiVault");
        const vault = await BlockFiVault.deploy(owner.address);

        await vault.addSupportedAsset(await mockUSDC.getAddress(), ethers.parseUnits("1", 18));
        await vault.addSupportedAsset(await mockETH.getAddress(), ethers.parseUnits("2500", 18));

        return { vault, mockUSDC, mockETH, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { vault, owner } = await loadFixture(deployVaultFixture);
            expect(await vault.owner()).to.equal(owner.address);
        });
    });

    describe("Deposits", function () {
        it("Should allow depositing assets", async function () {
            const { vault, mockUSDC, user1 } = await loadFixture(deployVaultFixture);
            const depositAmount = ethers.parseUnits("100", 18);

            await mockUSDC.mint(user1.address, depositAmount);
            await mockUSDC.connect(user1).approve(await vault.getAddress(), depositAmount);

            await expect(vault.connect(user1).deposit(await mockUSDC.getAddress(), depositAmount))
                .to.emit(vault, "Deposited")
                .withArgs(user1.address, await mockUSDC.getAddress(), depositAmount);

            const pos = await vault.userPositions(user1.address, await mockUSDC.getAddress());
            expect(pos.depositedAmount).to.equal(depositAmount);
        });
    });

    describe("Borrowing", function () {
        it("Should allow borrowing against collateral", async function () {
            const { vault, mockUSDC, mockETH, user1 } = await loadFixture(deployVaultFixture);

            const ethAmount = ethers.parseUnits("1", 18);
            await mockETH.mint(user1.address, ethAmount);
            await mockETH.connect(user1).approve(await vault.getAddress(), ethAmount);
            await vault.connect(user1).deposit(await mockETH.getAddress(), ethAmount);

            const borrowAmount = ethers.parseUnits("1000", 18);
            await expect(vault.connect(user1).borrow(await mockUSDC.getAddress(), borrowAmount))
                .to.emit(vault, "Borrowed")
                .withArgs(user1.address, await mockUSDC.getAddress(), borrowAmount);

            const pos = await vault.userPositions(user1.address, await mockUSDC.getAddress());
            expect(pos.borrowedAmount).to.equal(borrowAmount);
        });
    });
});
