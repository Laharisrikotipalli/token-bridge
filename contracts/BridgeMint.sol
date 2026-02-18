// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WrappedVaultToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeMint is Ownable {

    WrappedVaultToken public token;

    mapping(bytes32 => bool) public processed;

    constructor(address _token, address initialOwner)
        Ownable(initialOwner)
    {
        token = WrappedVaultToken(_token);
    }

    function mint(
        address to,
        uint256 amount,
        bytes32 txHash
    ) external onlyOwner {

        require(!processed[txHash], "Already processed");

        processed[txHash] = true;

        token.mint(to, amount);
    }

    function burn(uint256 amount) external {
        token.burn(msg.sender, amount);
    }
}
