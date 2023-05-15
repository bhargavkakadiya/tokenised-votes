import dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  paths: { tests: "tests" },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
