import { assert, expect } from "chai"
import { Contract } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe } from "../../typechain-types"
import { FundMeInterface } from "../../typechain-types/contracts/FundMe"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { developmentChain } from "../../helper-hardhat-config"

!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: FundMe
          let deployer: HardhatEthersSigner
          let mockV3Aggregator: Contract
          const sendValue = ethers.parseEther("1") // 1 ETH
          beforeEach(async () => {
              // deploy fundMe contract using hardhat-deploy
              const accounts = await ethers.getSigners()
              deployer = accounts[0]

              await deployments.fixture(["all"])
              const fundMeContract = await deployments.get("FundMe")
              const mockContract = await deployments.get("MockV3Aggregator")

              mockV3Aggregator = await ethers.getContractAt(
                  mockContract.abi,
                  mockContract.address
              )

              fundMe = (await ethers.getContractAt(
                  fundMeContract.abi,
                  fundMeContract.address
              )) as any as FundMe
          })
          describe("constructor", async () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  const mockAddress = await mockV3Aggregator.getAddress()
                  assert.equal(response, mockAddress)
              })
          })

          describe("fund", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer.address
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer.address)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("Can withdraw ETH from a single founder", async () => {
                  const fundMeAddress = await fundMe.getAddress()
                  const startingFundMeBalance =
                      await fundMe.runner!.provider!.getBalance(fundMeAddress)

                  const startingDeployerBalance =
                      await fundMe.runner!.provider!.getBalance(
                          deployer.address
                      )

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt!
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance =
                      await fundMe.runner!.provider!.getBalance(fundMeAddress)
                  const endingDeployerBalance =
                      await fundMe.runner!.provider!.getBalance(
                          deployer.address
                      )

                  assert.equal(endingFundMeBalance.toString(), "0")
                  assert.equal(
                      endingDeployerBalance.toString(),
                      (
                          startingFundMeBalance +
                          startingDeployerBalance -
                          gasCost
                      ).toString()
                  )
              })
              it("Allows us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })

                      const fundMeAddress = await fundMe.getAddress()
                      const startingFundMeBalance =
                          await fundMe.runner!.provider!.getBalance(
                              fundMeAddress
                          )

                      const startingDeployerBalance =
                          await fundMe.runner!.provider!.getBalance(
                              deployer.address
                          )

                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )
                      const { gasUsed, gasPrice } = transactionReceipt!
                      const gasCost = gasUsed * gasPrice

                      const endingFundMeBalance =
                          await fundMe.runner!.provider!.getBalance(
                              fundMeAddress
                          )
                      const endingDeployerBalance =
                          await fundMe.runner!.provider!.getBalance(
                              deployer.address
                          )

                      assert.equal(endingFundMeBalance.toString(), "0")
                      assert.equal(
                          endingDeployerBalance.toString(),
                          (
                              startingFundMeBalance +
                              startingDeployerBalance -
                              gasCost
                          ).toString()
                      )

                      // funders are reset
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              ),
                              BigInt("0")
                          )
                      }
                  }
              })
              it("Only allows Owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
          describe("cheaperWithdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("Can withdraw ETH from a single founder", async () => {
                  const fundMeAddress = await fundMe.getAddress()
                  const startingFundMeBalance =
                      await fundMe.runner!.provider!.getBalance(fundMeAddress)

                  const startingDeployerBalance =
                      await fundMe.runner!.provider!.getBalance(
                          deployer.address
                      )

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt!
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance =
                      await fundMe.runner!.provider!.getBalance(fundMeAddress)
                  const endingDeployerBalance =
                      await fundMe.runner!.provider!.getBalance(
                          deployer.address
                      )

                  assert.equal(endingFundMeBalance.toString(), "0")
                  assert.equal(
                      endingDeployerBalance.toString(),
                      (
                          startingFundMeBalance +
                          startingDeployerBalance -
                          gasCost
                      ).toString()
                  )
              })
              it("Allows us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })

                      const fundMeAddress = await fundMe.getAddress()
                      const startingFundMeBalance =
                          await fundMe.runner!.provider!.getBalance(
                              fundMeAddress
                          )

                      const startingDeployerBalance =
                          await fundMe.runner!.provider!.getBalance(
                              deployer.address
                          )

                      const transactionResponse = await fundMe.cheaperWithdraw()
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )
                      const { gasUsed, gasPrice } = transactionReceipt!
                      const gasCost = gasUsed * gasPrice

                      const endingFundMeBalance =
                          await fundMe.runner!.provider!.getBalance(
                              fundMeAddress
                          )
                      const endingDeployerBalance =
                          await fundMe.runner!.provider!.getBalance(
                              deployer.address
                          )

                      assert.equal(endingFundMeBalance.toString(), "0")
                      assert.equal(
                          endingDeployerBalance.toString(),
                          (
                              startingFundMeBalance +
                              startingDeployerBalance -
                              gasCost
                          ).toString()
                      )

                      // funders are reset
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              ),
                              BigInt("0")
                          )
                      }
                  }
              })
              it("Only allows Owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.cheaperWithdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
      })
