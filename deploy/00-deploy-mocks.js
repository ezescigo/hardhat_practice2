"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const deployMocks = async function ({ getNamedAccounts, deployments, }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    if (helper_hardhat_config_1.developmentChain.includes(hardhat_1.network.name)) {
        log("Local network detected, deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [helper_hardhat_config_1.DECIMALS, helper_hardhat_config_1.INITIAL_ANSWER],
        });
        log("Mocks deployed!!!!");
        log("---------------------------------------------------");
    }
};
exports.default = deployMocks;
deployMocks.tags = ["all", "mocks"];
