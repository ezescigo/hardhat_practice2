"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const verify_1 = require("../utils/verify");
const fundMe = async function ({ getNamedAccounts, deployments, }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = hardhat_1.network.config.chainId;
    let ethUsdPriceFeedAddress;
    if (helper_hardhat_config_1.developmentChain.includes(hardhat_1.network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddress = Object.entries(helper_hardhat_config_1.networkConfig).find(([key, value]) => key === chainId.toString())?.[1].ethUsdPriceFeed;
    }
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        // waitConfirmations: 6,
    });
    if (!helper_hardhat_config_1.developmentChain.includes(hardhat_1.network.name) &&
        process.env.ETHERSCAN_API_KEY) {
        await (0, verify_1.verify)(fundMe.address, args);
    }
};
exports.default = fundMe;
fundMe.tags = ["all", "fundme"];
