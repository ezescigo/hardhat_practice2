import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import {
    ChainId,
    NetworkConfigType,
    networkConfig,
} from "../helper-hardhat-config"

const func: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId as number

    const ethUsdPriceFeedAddress = Object.entries(networkConfig).find(
        ([key, value]) => key === chainId.toString()
    )

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [],
        log: true,
    })
}

export default func
