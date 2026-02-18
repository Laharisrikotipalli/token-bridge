// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WrappedVaultToken.sol";

contract GovernanceVoting {

    WrappedVaultToken public token;
    uint256 public proposalCount;

    struct Proposal {
        uint256 id;
        bytes data;
        uint256 votes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalPassed(uint256 proposalId, bytes data);

    constructor(address _token) {
        token = WrappedVaultToken(_token);
    }

    function createProposal(bytes memory data) external {
        proposalCount++;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            data: data,
            votes: 0,
            executed: false
        });
    }

    function vote(uint256 proposalId) external {

        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 votingPower = token.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");

        proposals[proposalId].votes += votingPower;
        hasVoted[proposalId][msg.sender] = true;
    }

    function executeProposal(uint256 proposalId) external {

        Proposal storage proposal = proposals[proposalId];

        require(!proposal.executed, "Already executed");
        require(proposal.votes > 0, "Not enough votes");

        proposal.executed = true;

        emit ProposalPassed(proposalId, proposal.data);
    }
}
