// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

interface IMyVotingToken {
    function getPastVotes(
        address account,
        uint blockNumber
    ) external view returns (uint);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyVotingToken public myVotingTokenContract;
    Proposal[] public proposals;
    uint public targetBlockNumber;

    mapping(address => uint) public votingPowerSpent;

    constructor(
        bytes32[] memory proposalNames,
        address _myVotingTokenContract,
        uint _targetBlockNumber
    ) {
        myVotingTokenContract = IMyVotingToken(_myVotingTokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint proposal, uint _amount) external {
        require(votingPower(msg.sender) >= _amount, "Not enough voting power");
        votingPowerSpent[msg.sender] += _amount;
        proposals[proposal].voteCount += _amount;
    }

    function votingPower(address _account) public view returns (uint) {
        return
            myVotingTokenContract.getPastVotes(_account, targetBlockNumber) -
            votingPowerSpent[_account];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
