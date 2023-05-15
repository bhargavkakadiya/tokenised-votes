# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

Clean Repo
```shell
rm tests/*
rm scripts/*
rm contracts/*
yarn hardhat clean
```

Deploy ERC20

```shell
yarn hardhat run scripts/deploy.ts --network sepolia # deploy
yarn hardhat verify --network sepolia <contract> # verify
```

Deploy TokenizedBallot

- requires updating deploy.ts and arguments.js

```shell
yarn hardhat run scripts/deploy.ts --network sepolia # deploy
yarn hardhat verify --network sepolia --constructor-args scripts/arguments.js <contract code>
```
