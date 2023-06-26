"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("FundMe", async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = hardhat_1.ethers.parseEther("1"); // 1 ETH
    beforeEach(async () => {
        // deploy fundMe contract using hardhat-deploy
        const accounts = await hardhat_1.ethers.getSigners();
        deployer = accounts[0];
        await hardhat_1.deployments.fixture(["all"]);
        const fundMeContract = await hardhat_1.deployments.get("FundMe");
        const mockContract = await hardhat_1.deployments.get("MockV3Aggregator");
        mockV3Aggregator = await hardhat_1.ethers.getContractAt(mockContract.abi, mockContract.address);
        fundMe = (await hardhat_1.ethers.getContractAt(fundMeContract.abi, fundMeContract.address));
    });
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.s_priceFeed();
            const mockAddress = await mockV3Aggregator.getAddress();
            chai_1.assert.equal(response, mockAddress);
        });
    });
    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            await (0, chai_1.expect)(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        });
        it("Updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.addressToAmountFunded(deployer.address);
            chai_1.assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            chai_1.assert.equal(funder, deployer.address);
        });
    });
    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue });
        });
        it("Can withdraw ETH from a single founder", async () => {
            const fundMeAddress = await fundMe.getAddress();
            const startingFundMeBalance = await fundMe.runner.provider.getBalance(fundMeAddress);
            const startingDeployerBalance = await fundMe.runner.provider.getBalance(deployer.address);
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const { gasUsed, gasPrice } = transactionReceipt;
            const gasCost = gasUsed * gasPrice;
            console.log("gasCost", gasCost);
            const endingFundMeBalance = await fundMe.runner.provider.getBalance(fundMeAddress);
            const endingDeployerBalance = await fundMe.runner.provider.getBalance(deployer.address);
            chai_1.assert.equal(endingFundMeBalance.toString(), "0");
            chai_1.assert.equal((endingDeployerBalance + gasCost).toString(), (startingFundMeBalance + startingDeployerBalance).toString());
        });
    });
});
