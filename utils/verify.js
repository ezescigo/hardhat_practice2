"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const hardhat_1 = require("hardhat");
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
        await (0, hardhat_1.run)("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    }
    catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        }
        else {
            console.log(e);
        }
    }
};
exports.verify = verify;
