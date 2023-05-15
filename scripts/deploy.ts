import { ethers } from "hardhat";

async function deployERC20() {
  const contractFactory = await ethers.getContractFactory("MyVotingToken");
  const contract = await contractFactory.deploy();

  const deployTx = await contract.deployed();

  console.log("MyVotingToken deployed to:", deployTx.address);
  console.log(
    "Etherscan:",
    `https://sepolia.etherscan.io/tx/${deployTx.deployTransaction.hash}`
  );
}

async function deployTokenizedBallot(
  _PROPOSALS: string[],
  _contractAddress: string,
  _targetBlockNumber: number
) {
  const contractFactory = await ethers.getContractFactory("TokenizedBallot");
  const contract = await contractFactory.deploy(
    _PROPOSALS.map(ethers.utils.formatBytes32String),
    _contractAddress,
    _targetBlockNumber
  );

  const deployTx = await contract.deployed();

  console.log("TokenizedBallot deployed to:", deployTx.address);
  console.log(
    "Etherscan:",
    `https://sepolia.etherscan.io/tx/${deployTx.deployTransaction.hash}`
  );
}

async function main() {
  // USE this to deploy the ERC20 contract
  // await deployERC20();

  const PROPOSALS = ["Brownie", "Truffle", "Waffle"];
  const TARGETBLOCKNUMBER = 3489660;
  const contractERC20 = "0x1734E67eE6c21f2Ff59CC9F9B209f798f2448862";

  // USE this to log and update the arguments.js file when verifying on etherscan
  console.log(
    PROPOSALS.map(ethers.utils.formatBytes32String),
    contractERC20,
    TARGETBLOCKNUMBER
  );

  // await deployTokenizedBallot(PROPOSALS, contractERC20, TARGETBLOCKNUMBER);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
