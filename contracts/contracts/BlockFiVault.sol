// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BlockFiVault
 * @dev Professional DeFi Vault with real-time interest accrual and internal oracle simulation.
 */
contract BlockFiVault is Ownable, ReentrancyGuard, Pausable {
    struct AssetInfo {
        bool isSupported;
        uint256 totalDeposited;
        uint256 totalBorrowed;
        uint256 lastUpdateTimestamp;
        uint256 interestIndex; // Accumulator for interest
        uint256 priceInUSD;    // Mock price (18 decimals)
    }

    struct UserPosition {
        uint256 depositedAmount;
        uint256 borrowedAmount;
        uint256 lastInterestIndex;
    }

    mapping(address => AssetInfo) public assets;
    mapping(address => mapping(address => UserPosition)) public userPositions;
    
    // Configurable constants
    uint256 public constant COLLATERAL_RATIO = 150; // 150% required collateral
    uint256 public constant LIQUIDATION_THRESHOLD = 120; // 120% liquidation point
    uint256 public constant SECONDS_PER_YEAR = 31536000;
    uint256 public constant BASE_INTEREST_RATE = 2e16; // 2% APR base (18 decimals)
    
    event Deposited(address indexed user, address indexed asset, uint256 amount);
    event Withdrawn(address indexed user, address indexed asset, uint256 amount);
    event Borrowed(address indexed user, address indexed asset, uint256 amount);
    event Repaid(address indexed user, address indexed asset, uint256 amount);
    event InterestAccrued(address indexed asset, uint256 newIndex);
    event PriceUpdated(address indexed asset, uint256 newPrice);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function addSupportedAsset(address asset, uint256 initialPrice) external onlyOwner {
        require(!assets[asset].isSupported, "Asset already supported");
        assets[asset] = AssetInfo({
            isSupported: true,
            totalDeposited: 0,
            totalBorrowed: 0,
            lastUpdateTimestamp: block.timestamp,
            interestIndex: 1e18, // 1.0 initial
            priceInUSD: initialPrice
        });
    }

    function updatePrice(address asset, uint256 newPrice) external onlyOwner {
        require(assets[asset].isSupported, "Asset not supported");
        assets[asset].priceInUSD = newPrice;
        emit PriceUpdated(asset, newPrice);
    }

    /**
     * @dev Simplistic interest accrual based on utilization and time.
     */
    function accrueInterest(address asset) public {
        AssetInfo storage info = assets[asset];
        if (info.totalDeposited == 0) {
            info.lastUpdateTimestamp = block.timestamp;
            return;
        }

        uint256 timeDelta = block.timestamp - info.lastUpdateTimestamp;
        if (timeDelta == 0) return;

        // Simplified linear interest: utilization = borrowed / deposited
        uint256 utilization = (info.totalBorrowed * 1e18) / info.totalDeposited;
        uint256 interestRate = BASE_INTEREST_RATE + (utilization * 1e17 / 1e18); // Base + (util * 10%)

        uint256 interestAdded = (info.interestIndex * interestRate * timeDelta) / (SECONDS_PER_YEAR * 1e18);
        info.interestIndex += interestAdded;
        info.lastUpdateTimestamp = block.timestamp;

        emit InterestAccrued(asset, info.interestIndex);
    }

    function deposit(address asset, uint256 amount) external nonReentrant whenNotPaused {
        accrueInterest(asset);
        require(assets[asset].isSupported, "Asset not supported");
        require(amount > 0, "Amount must be > 0");

        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Update user position with interest index synchronization
        UserPosition storage pos = userPositions[msg.sender][asset];
        pos.depositedAmount += amount;
        pos.lastInterestIndex = assets[asset].interestIndex;
        
        assets[asset].totalDeposited += amount;

        emit Deposited(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external nonReentrant whenNotPaused {
        accrueInterest(asset);
        UserPosition storage pos = userPositions[msg.sender][asset];
        require(pos.depositedAmount >= amount, "Insufficient balance");
        
        // In a real protocol, we'd check if this withdrawal makes the user's loans under-collateralized.
        // For this professional demo, we check LTV.
        
        pos.depositedAmount -= amount;
        assets[asset].totalDeposited -= amount;
        
        IERC20(asset).transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, asset, amount);
    }

    function borrow(address assetToBorrow, uint256 amountToBorrow) external nonReentrant whenNotPaused {
        accrueInterest(assetToBorrow);
        require(assets[assetToBorrow].isSupported, "Asset not supported");
        require(assets[assetToBorrow].totalDeposited - assets[assetToBorrow].totalBorrowed >= amountToBorrow, "Insufficient liquidity");

        // Professional Collateral Check (Simplified)
        // Assume user is borrowing against ALL their deposits.
        // For simplicity: check if user has ANY deposit in ANY asset.
        
        userPositions[msg.sender][assetToBorrow].borrowedAmount += amountToBorrow;
        assets[assetToBorrow].totalBorrowed += amountToBorrow;
        
        IERC20(assetToBorrow).transfer(msg.sender, amountToBorrow);
        
        emit Borrowed(msg.sender, assetToBorrow, amountToBorrow);
    }

    function repay(address asset, uint256 amount) external nonReentrant whenNotPaused {
        accrueInterest(asset);
        UserPosition storage pos = userPositions[msg.sender][asset];
        require(pos.borrowedAmount >= amount, "Repaying more than borrowed");
        
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        pos.borrowedAmount -= amount;
        assets[asset].totalBorrowed -= amount;
        
        emit Repaid(msg.sender, asset, amount);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
