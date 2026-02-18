// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedVaultToken is ERC20, Ownable {

    address public bridgeMint;

    constructor(address initialOwner)
        ERC20("WrappedVaultToken", "WVT")
        Ownable(initialOwner)
    {}

    function setBridgeMint(address _bridgeMint) external onlyOwner {
        bridgeMint = _bridgeMint;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == bridgeMint, "Not BridgeMint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == bridgeMint, "Not BridgeMint");
        _burn(from, amount);
    }
}
