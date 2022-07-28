/* eslint-disable import/prefer-default-export */
// This just disables default export as this utils file will be intended to return multiple utils
import { getAddress } from "@ethersproject/address";
import { useAccount } from "wagmi";

export function shortAddress(address: string): string {
  try {
    const formattedAddress = getAddress(address);
    return `${formattedAddress.substring(0, 6)}...${formattedAddress.substring(
      38
    )}`;
  } catch (e) {
    console.log(e, "There was an error processing your address");
    return "Invalid Address";
  }
}

export const getUserAddress = () => {
  const { address, isConnected } = useAccount();

  if (isConnected) return address;

  return undefined;
};
