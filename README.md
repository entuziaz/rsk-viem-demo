
## RSK Viem Demo

This is a Next.js project that shows how to use Viem to interact with deployed Rootstock (RSK) smart contacts.

### Getting Started

First, clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the root of the project to store your secrets:

```bash
NEXT_PUBLIC_RPC_URL='https://rpc.testnet.rootstock.io/<API_KEY>'
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC19f0882BF318C9f8767c7D520018888E878417B
```

You can obtain the RPC URL by following the official guide for [setting up the RPC API](https://dev.rootstock.io/developers/rpc-api/rootstock/setup/). You can fetch the contract address for the lending contract used in this repo from the [Rootstock Explorer](https://explorer.testnet.rootstock.io/address/0xc19f0882bf318c9f8767c7d520018888e878417b). If you are using your preferred smart contract, you would have to supply the contract address after deployment. 

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can view and edit the code in:

- `utils/viem.ts` - The logic for using Viem to connect with RSK contracts
- `pages/index.tsx` - UI layer for interacting with the app

The app auto-updates as you edit the files.

### Learn More

To learn more about Viem, Rootstock and Next.js, take a look at the following resources:

- [Viem Documentation](https://viem.sh/docs/getting-started) - learn more about Viem and features
- [Rootstock Documentation](https://dev.rootstock.io/) - learn more about the Rootstock layer-2 chain
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
