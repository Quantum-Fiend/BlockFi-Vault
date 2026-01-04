import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    console.log("Starting BlockFi Vault Deployment...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy BlockFiToken (BVF)
    const BlockFiToken = await ethers.getContractFactory("BlockFiToken");
    const bvf = await BlockFiToken.deploy();
    await bvf.waitForDeployment();
    console.log("BlockFiToken (BVF) deployed to:", await bvf.getAddress());

    // 2. Deploy BlockFiVault
    const BlockFiVault = await ethers.getContractFactory("BlockFiVault");
    const vault = await BlockFiVault.deploy(deployer.address);
    await vault.waitForDeployment();
    console.log("BlockFiVault deployed to:", await vault.getAddress());

    // 3. Setup initial assets (Simulation/Production mixed)
    // In production, these would be real token addresses
    const MockToken = await ethers.getContractFactory("MockToken");

    const usdc = await MockToken.deploy("USD Coin", "USDC");
    await usdc.waitForDeployment();
    console.log("Mock USDC deployed to:", await usdc.getAddress());

    const wbtc = await MockToken.deploy("Wrapped BTC", "WBTC");
    await wbtc.waitForDeployment();
    console.log("Mock WBTC deployed to:", await wbtc.getAddress());

    // Register assets in Vault
    await vault.addSupportedAsset(await usdc.getAddress(), ethers.parseUnits("1", 18));
    await vault.addSupportedAsset(await wbtc.getAddress(), ethers.parseUnits("65000", 18));

    console.log("Asset registration complete.");
    console.log("Deployment Successful!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
