"use strict";
// taken from https://github.com/aave/aave-v3-core/blob/master/helper-hardhat-config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCK_TO_FORK = exports.NETWORKS_RPC_URL = exports.buildForkConfig = exports.eEthereumNetwork = void 0;
// import { eEthereumNetwork, iParamsPerNetwork } from "./helpers/types"
var eEthereumNetwork;
(function (eEthereumNetwork) {
    eEthereumNetwork["kovan"] = "kovan";
    eEthereumNetwork["ropsten"] = "ropsten";
    eEthereumNetwork["main"] = "main";
    eEthereumNetwork["coverage"] = "coverage";
    eEthereumNetwork["hardhat"] = "hardhat";
    eEthereumNetwork["tenderlyMain"] = "tenderlyMain";
})(eEthereumNetwork || (exports.eEthereumNetwork = eEthereumNetwork = {}));
require("dotenv").config();
const INFURA_KEY = process.env.INFURA_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const TENDERLY_FORK_ID = process.env.TENDERLY_FORK_ID || "";
const FORK = process.env.FORK || "";
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
    ? parseInt(process.env.FORK_BLOCK_NUMBER)
    : 0;
const GWEI = 1000 * 1000 * 1000;
const buildForkConfig = () => {
    let forkMode;
    if (FORK) {
        forkMode = {
            url: exports.NETWORKS_RPC_URL[FORK],
        };
        if (FORK_BLOCK_NUMBER || exports.BLOCK_TO_FORK[FORK]) {
            forkMode.blockNumber =
                FORK_BLOCK_NUMBER || exports.BLOCK_TO_FORK[FORK];
        }
    }
    return forkMode;
};
exports.buildForkConfig = buildForkConfig;
exports.NETWORKS_RPC_URL = {
    [eEthereumNetwork.kovan]: ALCHEMY_KEY
        ? `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`
        : `https://kovan.infura.io/v3/${INFURA_KEY}`,
    [eEthereumNetwork.ropsten]: ALCHEMY_KEY
        ? `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_KEY}`
        : `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    [eEthereumNetwork.main]: ALCHEMY_KEY
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    [eEthereumNetwork.coverage]: "http://localhost:8555",
    [eEthereumNetwork.hardhat]: "http://localhost:8545",
    [eEthereumNetwork.tenderlyMain]: `https://rpc.tenderly.co/fork/${TENDERLY_FORK_ID}`,
};
exports.BLOCK_TO_FORK = {
    [eEthereumNetwork.main]: 12406069,
    [eEthereumNetwork.kovan]: undefined,
    [eEthereumNetwork.ropsten]: undefined,
    [eEthereumNetwork.coverage]: undefined,
    [eEthereumNetwork.hardhat]: undefined,
    [eEthereumNetwork.tenderlyMain]: 12406069,
};
