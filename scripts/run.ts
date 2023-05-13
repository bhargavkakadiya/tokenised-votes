import {ethers} from "hardhat";
import { MyVotingToken, MyVotingToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import { Signer, BigNumber } from "ethers";


const MINT_VALUE = ethers.utils.parseUnits("10");
const PROPOSALS = ["Brownie", "Truffle", "Waffle"];
const TARGETBLOCKNUMBER = 7;



async function getERC20Balance(_acc : string, _contract : MyVotingToken) {
    console.log("Balance of acc1:", ethers.utils.formatUnits(await _contract.balanceOf(_acc)), await _contract.symbol());
    return ethers.utils.formatUnits(await _contract.balanceOf(_acc));
}

async function mintERC20(_acc : string, _contract : MyVotingToken) {
    const mintTx = await _contract.mint(_acc, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log("==================Minting tokens===================");
    console.log("Minted tokens to:", _acc, "at block:", mintTxReceipt.blockNumber);
    return true;
}

async function getVotingPowerOfAccount(_acc : string, _contract : MyVotingToken) {
    const votes = await _contract.getVotes(_acc);
    console.log("Voting Power of", _acc, ":", ethers.utils.formatUnits(votes));
    return votes;
}

async function delegateVotes(_acc : Signer, _accTo : string, _contract : MyVotingToken) {
    const delegateTx = await _contract.connect(_acc).delegate(_accTo);
    const delegateTxReceipt = await delegateTx.wait();
    console.log("==================Delegating votes===================");
    console.log("Account", await _acc.getAddress(), "delegated votes to", _accTo, "at block:", delegateTxReceipt.blockNumber);
    return true;
}

async function castVote(_acc : Signer, _proposalId : number, _amtToVote: BigNumber | number, _contract : TokenizedBallot) {
    
    const voteTx = await _contract.connect(_acc).vote(_proposalId, _amtToVote);
    const voteTxReceipt = await voteTx.wait();
    console.log(await _acc.getAddress(), "voted for:", PROPOSALS[_proposalId], "at block:", voteTxReceipt.blockNumber);
    return true;
}

async function getVoteCountSummary(_contract : TokenizedBallot) {
    console.log("==================Vote Count Summary===================");
    for (let i = 0; i < PROPOSALS.length; i++) {
        let proposal = await _contract.proposals(i);
        console.log(`Proposal N.${i + 1}: ${ethers.utils.parseBytes32String(proposal.name)} has ${ethers.utils.formatUnits(proposal.voteCount)} votes`);
    }
}

async function getVotingPowerSummary(_contract : MyVotingToken) {
    console.log("==================Voting Power Summary===================");
    const [deployer,acc1,acc2] = await ethers.getSigners();
    const accounts = [acc1,acc2];
    for (let i = 0; i < accounts.length; i++) {
        console.log("Voting Power of", await accounts[i].getAddress(), ":", ethers.utils.formatUnits(await _contract.getVotes(await accounts[i].getAddress())));
    }
}


async function main() {
    
    // Deploying ERC20 contract
    const [deployer, acc1, acc2] = await ethers.getSigners();
    const contractFactoryMyVotingToken = new MyVotingToken__factory(deployer);
    const contractERC20 = await contractFactoryMyVotingToken.deploy();
    const deployTx = await contractERC20.deployed();
    console.log("MyVotingToken Contract deployed to:", contractERC20.address, "at block:", deployTx.deployTransaction.blockNumber);

    await mintERC20(acc1.address, contractERC20);

    await getERC20Balance(acc1.address, contractERC20);

    await getVotingPowerOfAccount(acc1.address, contractERC20);
    // its zero since its not delegated to anyone

    // delegate votes to self to get voting power
    await delegateVotes(acc1, acc1.address, contractERC20);

    await getVotingPowerOfAccount(acc1.address, contractERC20);

    // Proposals list
    console.log("==================Proposals===================");
    PROPOSALS.forEach((element, index) => {
            console.log(`Proposal N.${index + 1}: ${element}`);
        });

    console.log("==================Deploying TokenizedBallot===================");
    // Delplot TokenizedBallot contract
    const contractFactoryTokenizedBallot = new TokenizedBallot__factory(deployer);
    const contractTokenizedBallot = await contractFactoryTokenizedBallot.deploy(PROPOSALS.map(
        ethers.utils.formatBytes32String
    ), contractERC20.address, TARGETBLOCKNUMBER);
    const deployTxTokenizedBallot = await contractTokenizedBallot.deployed();
    console.log("TokenizedBallot Contract deployed to:", contractTokenizedBallot.address, "at block:", deployTxTokenizedBallot.deployTransaction.blockNumber);

    console.log("==================Acc2 gets tokens===================");
    // Acc2
    await mintERC20(acc2.address, contractERC20);

    await getERC20Balance(acc2.address, contractERC20);

    // delegate votes to acc1 to get voting power
    await delegateVotes(acc2, acc1.address, contractERC20);

    await getVotingPowerOfAccount(acc2.address, contractERC20);

    await getVotingPowerSummary(contractERC20);
    
    await delegateVotes(acc1, acc1.address, contractERC20);
    await getVotingPowerSummary(contractERC20);
    
    // Voting
    console.log("==================Voting===================");
    
    const amtToVote = await getVotingPowerOfAccount(acc1.address, contractERC20);
    await castVote(acc1, 0, amtToVote, contractTokenizedBallot);
    
    await getVotingPowerSummary(contractERC20);

    // Chechking vote count for all proposals and printing summary
    await getVoteCountSummary(contractTokenizedBallot);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

