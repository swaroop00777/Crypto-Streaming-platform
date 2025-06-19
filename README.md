# StreamBlock - Decentralized Crypto Streaming Platform

A Web3-enabled streaming platform where viewers can tip streamers with USDC on Ethereum Sepolia testnet.

## 🚀 Features

- **Real MetaMask Integration**: Connect actual wallets, no mock data
- **Ethereum Sepolia Testnet**: Fast, reliable testnet with real USDC
- **USDC Tipping**: Send real testnet USDC tips to streamers
- **Transaction Tracking**: Monitor tip confirmations on-chain
- **Responsive Design**: Works on desktop and mobile
- **Creator Dashboard**: Stream management and earnings tracking

## 🔧 Setup

### Prerequisites
- Node.js 18+ 
- MetaMask browser extension
- Sepolia ETH for gas fees
- Testnet USDC for tipping

### Installation

1. **Clone and install**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment**:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

3. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

### Getting Testnet Tokens

1. **Sepolia ETH** (for gas fees):
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

2. **Testnet USDC** (for tipping):
   - [Circle USDC Faucet](https://faucet.circle.com/)
   - Select Ethereum Sepolia network
   - Request testnet USDC to your wallet

### MetaMask Setup

1. **Add Sepolia Network**:
   - Network Name: `Sepolia test network`
   - RPC URL: `https://rpc.sepolia.org`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io/`

2. **Import USDC Token**:
   - Contract Address: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - Symbol: `USDC`
   - Decimals: `6`

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect MetaMask" and approve connection
2. **Get Testnet Tokens**: Use faucets to get Sepolia ETH and USDC
3. **Browse Streams**: Explore live streams on the platform
4. **Send Tips**: Tip your favorite streamers with USDC
5. **Track Transactions**: Monitor tip confirmations on Etherscan

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: ethers.js for blockchain interaction
- **Database**: Simple JSON-based storage (v0 compatible)
- **Network**: Ethereum Sepolia testnet
- **Token**: Circle's official testnet USDC

## 🔗 Important Links

- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Circle USDC Faucet](https://faucet.circle.com/)
- [MetaMask Download](https://metamask.io/download/)
- [Sepolia ETH Faucet](https://sepoliafaucet.com/)

## 🛠️ Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📝 Environment Variables

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
NEXT_PUBLIC_CHAIN_ID=11155111
\`\`\`

## 🎮 Testing

1. Connect MetaMask to Sepolia testnet
2. Get testnet ETH and USDC from faucets
3. Try tipping a streamer
4. Check transaction on Sepolia Etherscan
5. Verify tip appears in streamer's earnings

## 🚨 Important Notes

- This uses **testnet tokens** - no real money involved
- Sepolia ETH is needed for gas fees
- USDC tips are sent as real blockchain transactions
- All transactions are visible on Sepolia Etherscan
- Keep some ETH for gas when sending tips

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with testnet tokens
5. Submit a pull request

---

**Happy Streaming! 🎥✨**
