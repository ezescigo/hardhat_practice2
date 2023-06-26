import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import {
    ChainId,
    NetworkConfigType,
    DECIMALS,
    INITIAL_ANSWER,
    developmentChain,
    networkConfig,
} from "../helper-hardhat-config"

const deployMocks: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChain.includes(network.name)) {
        log("Local network detected, deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!!!!")
        log("---------------------------------------------------")
    }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]
