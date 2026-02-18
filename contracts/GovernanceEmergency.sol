// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBridgeLock {
    function pause() external;
}

contract GovernanceEmergency {

    address public relayer;
    IBridgeLock public bridgeLock;

    constructor(address _relayer, address _bridgeLock) {
        relayer = _relayer;
        bridgeLock = IBridgeLock(_bridgeLock);
    }

    function pauseBridge() external {
        require(msg.sender == relayer, "Not relayer");
        bridgeLock.pause();
    }
}
