import { assert } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"

describe("FundMe", async () => {
    let fundMe: any
    let deployer
    let MockV3Aggregator: any
    beforeEach(async () => {
        // deploy fundMe contract using hardhat-deploy
        const accounts = await ethers.getSigners()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContractFactory("FundMe")
        MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator")
    })
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.priceFeed()
            assert.equal(response, MockV3Aggregator.address)
        })
    })
})
