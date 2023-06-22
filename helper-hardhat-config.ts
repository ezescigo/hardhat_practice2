export interface NetworkConfigItemType {
    name: string
    ethUsdPriceFeed: string
}

export type NetworkConfigType = Record<ChainId, NetworkConfigItemType>

export type ChainId = 11155111 | 137

export const networkConfig: NetworkConfigType = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}

export const developmentChain = ["hardhat", "localhost"]
export const DECIMALS = 8
export const INITIAL_ANSWER = 200000000000

// export networkConfig
