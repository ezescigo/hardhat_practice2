import { deployments, ethers } from "hardhat"

const main = async () => {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const fundMeContract = await deployments.get("FundMe")
    const fundMe = await ethers.getContractAt(
        fundMeContract.abi,
        fundMeContract.address
    )
    console.log("Funding contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
