import {ethers} from "hardhat";
import { MyERC20Votes__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {

    // Deploying contract
    const [deployer, acc1, acc2] = await ethers.getSigners();
    const contractFactory = new MyERC20Votes__factory(deployer);
    const contract = await contractFactory.deploy();
    const deployTx = await contract.deployed();
    console.log("Contract deployed to:", contract.address, "at block:", deployTx.deployTransaction.blockNumber);

    // Minting tokens
    const mintTx = await contract.mint(acc1.address, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log("Minted tokens to:", acc1.address, "at block:", mintTxReceipt.blockNumber);

    // Check balance of acc1
    const balance = await contract.balanceOf(acc1.address);
    console.log("Balance of acc1:", ethers.utils.formatUnits(balance), await contract.symbol());

    // check votes of acc1
    const votes = await contract.getVotes(acc1.address);
    console.log("Votes of acc1:", votes.toString());
    // its zero since its not delegated to anyone

    // delegate votes to self to get voting power
    const delegateTx = await contract.connect(acc1).delegate(acc1.address);
    const delegateTxReceipt = await delegateTx.wait();
    console.log("Delegated votes to self at block:", delegateTxReceipt.blockNumber);

    // check votes of acc1
    const votesAfterDelegation = await contract.getVotes(acc1.address);
    console.log("Votes of acc1 after delegation:", ethers.utils.formatUnits(votesAfterDelegation));

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});