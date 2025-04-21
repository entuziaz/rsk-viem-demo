import { createPublicClient, createWalletClient, custom, getContract, http, getAddress } from 'viem';
import { rootstockTestnet } from 'viem/chains';
import { profileContractAbi } from './contractABI';


interface Window {
  ethereum?: any
}

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const CONTRACT_ADDRESS_ENV = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_ADDRESS = CONTRACT_ADDRESS_ENV as `0x${string}`;

export const publicClient = createPublicClient({
    chain: rootstockTestnet,
    transport: http(RPC_URL)
});

export const walletClient = typeof window !== 'undefined' && window.ethereum
  ? createWalletClient({
      chain: rootstockTestnet,
      transport: custom(window.ethereum),
    })
  : undefined;

export async function getConnectedAccount(): Promise<`0x${string}`> {
  if (!walletClient) throw new Error("Wallet client not available.");
  const [account] = await walletClient.requestAddresses();
  return account;
}

const lendingContract = getContract({
    abi: profileContractAbi, 
    address: getAddress(CONTRACT_ADDRESS), 
    client: publicClient 
})


export async function fetchBorrowRatePerBlock(): Promise<bigint> {
  const result = await publicClient.readContract({
    address: getAddress(CONTRACT_ADDRESS),
    abi: profileContractAbi,
    functionName: 'borrowRatePerBlock',
  })

  return result as bigint;
}

export async function fetchTotalSupply(): Promise<bigint> {
  return await lendingContract.read.totalSupply() as bigint;
}

export async function fetchTotalBorrows(): Promise<bigint> {
  return await lendingContract.read.totalBorrows() as bigint;
}

export async function fetchSymbol(): Promise<string> {
  return await lendingContract.read.symbol() as string;
}

export async function fetchBalanceOf(owner: `0x${string}`): Promise<bigint> {
  return await lendingContract.read.balanceOf([owner]) as bigint;
}


export async function borrow(amount: bigint): Promise<`0x${string}`> {
  if (!walletClient) throw new Error("Wallet client not available.");
  const account = await getConnectedAccount();

  let request;
  try {
    // Simulating first as dry-run
    const simulation = await publicClient.simulateContract({
      address: getAddress(CONTRACT_ADDRESS),
      abi: profileContractAbi,
      functionName: 'borrow',
      args: [amount],
      account,
    });
    console.log("Simulated transaction: ", simulation.request)
    request = simulation.request;
  } catch (error: any) {
    const message =
      error?.shortMessage ||
      error?.message ||
      'Simulation failed. Please check your inputs.';
    throw new Error(`Simulation error: ${message}`);
  }

  try {
    // Real tx run — show wallet popup
    const txHash = await walletClient.writeContract(request);
    console.log("Sent transaction: ", txHash)

    return txHash;
  } catch (error: any) {
    if (error?.code === 4001) {
      // MetaMask user rejected
      throw new Error('Transaction cancelled by user.');
    }

    const message =
      error?.shortMessage ||
      error?.message ||
      'Transaction failed. Please try again.';
    throw new Error(`Transaction error: ${message}`);
  }
}
