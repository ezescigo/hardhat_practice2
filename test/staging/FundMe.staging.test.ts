import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe } from "../../typechain-types"
import { developmentChain } from "../../helper-hardhat-config"
import { send } from "process"
import { assert } from "chai"

// Only run on testnets
developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: FundMe
          let deployer: HardhatEthersSigner
          const sendValue = ethers.parseEther("1")

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              // deployer = (await getNamedAccounts()).deployer

              const fundMeContract = await deployments.get("FundMe")
              console.log("fundMeContract", fundMeContract)

              fundMe = (await ethers.getContractAt(
                  fundMeContract.abi,
                  fundMeContract.address
              )) as any as FundMe
          })

          it("Allows people to fund and withdraw", async () => {
              const fundMeAddress = await fundMe.getAddress()

              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.runner?.provider?.getBalance(
                  fundMeAddress
              )
              assert.equal(endingBalance?.toString(), "0")
          })
      })
