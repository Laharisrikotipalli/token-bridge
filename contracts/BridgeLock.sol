// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeLock is Pausable, Ownable {

    IERC20 public vaultToken;
    address public relayer;

    uint256 public currentNonce;
    mapping(uint256 => bool) public processedNonces;

    event Locked(address indexed user, uint256 amount, uint256 nonce);

    constructor(address _vaultToken, address _relayer)
        Ownable(msg.sender)
    {
        vaultToken = IERC20(_vaultToken);
        relayer = _relayer;
    }

    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    function lock(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be > 0");

        vaultToken.transferFrom(msg.sender, address(this), amount);

        currentNonce++;
        emit Locked(msg.sender, amount, currentNonce);
    }

    function unlock(address user, uint256 amount, uint256 nonce) external {
        require(msg.sender == relayer, "Not relayer");
        require(!processedNonces[nonce], "Already processed");

        processedNonces[nonce] = true;

        vaultToken.transfer(user, amount);
    }

    function pause() external {
        require(msg.sender == relayer, "Not relayer");
        _pause();
    }
}
