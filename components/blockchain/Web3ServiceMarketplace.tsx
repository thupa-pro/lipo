import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Wallet, Coins, TrendingUp, Lock, Unlock, ExternalLink, Copy, QrCode, Zap, Globe, Database, FileText, Award, Handshake, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface SmartContract {
  address: string;
  network: string;
  name: string;
  version: string;
  abi: any[];
  verified: boolean;
}

interface NFTCredential {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  issuer: string;
  issuedAt: string;
  verified: boolean;
}

interface Web3Transaction {
  hash: string;
  type: "payment" | "escrow" | "credential" | "review" | "stake";
  amount: string;
  currency: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
}

interface Web3ServiceMarketplaceProps {
  serviceId?: string;
  providerId?: string;
  onWalletConnect?: (address: string) => void;
  onTransaction?: (transaction: Web3Transaction) => void;
  className?: string;
}

export function Web3ServiceMarketplace({
  serviceId,
  providerId,
  onWalletConnect,
  onTransaction,
  className = ""
}: Web3ServiceMarketplaceProps) {
  const t = useTranslations("web3");
  const locale = useLocale();
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<Record<string, string>>({});
  const [network, setNetwork] = useState<string>("ethereum");
  const [transactions, setTransactions] = useState<Web3Transaction[]>([]);
  const [nftCredentials, setNftCredentials] = useState<NFTCredential[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [escrowBalance, setEscrowBalance] = useState<string>("0");
  const [reputation, setReputation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string>("");

  const web3Ref = useRef<any>(null);
  const contractRef = useRef<any>(null);

  // Initialize Web3 connection
  useEffect(() => {
    initializeWeb3();
    loadSmartContracts();
    checkWalletConnection();
  }, []);

  const initializeWeb3 = async () => {
    try {
      // Check if Web3 is available
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const Web3 = (await import("web3")).default;
        web3Ref.current = new Web3((window as any).ethereum);
        
        // Listen for account changes
        (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.on('chainChanged', handleChainChanged);
        
        return true;
      } else {
        console.log("MetaMask not detected");
        return false;
      }
    } catch (error) {
      console.error("Error initializing Web3:", error);
      return false;
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (web3Ref.current) {
        const accounts = await web3Ref.current.eth.getAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await loadWalletData(accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (web3Ref.current) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await loadWalletData(accounts[0]);
          
          if (onWalletConnect) {
            onWalletConnect(accounts[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setBalance({});
    setTransactions([]);
  };

  const loadWalletData = async (address: string) => {
    try {
      // Load balance
      const ethBalance = await web3Ref.current.eth.getBalance(address);
      const ethBalanceFormatted = web3Ref.current.utils.fromWei(ethBalance, 'ether');
      
      setBalance({
        ETH: parseFloat(ethBalanceFormatted).toFixed(4),
        USDC: "1,250.00", // Mock USDC balance
        LOCO: "500.75"    // Mock LOCO token balance
      });

      // Load transactions
      await loadTransactionHistory(address);
      
      // Load NFT credentials
      await loadNFTCredentials(address);
      
      // Load reputation
      await loadReputation(address);
      
    } catch (error) {
      console.error("Error loading wallet data:", error);
    }
  };

  const loadTransactionHistory = async (address: string) => {
    // Mock transaction data
    const mockTransactions: Web3Transaction[] = [
      {
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        type: "payment",
        amount: "0.05",
        currency: "ETH",
        status: "confirmed",
        timestamp: new Date(Date.now() - 3600000),
        gasUsed: "21000",
        gasPrice: "20",
        blockNumber: 18500000
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef12",
        type: "escrow",
        amount: "100.00",
        currency: "USDC",
        status: "pending",
        timestamp: new Date(Date.now() - 1800000),
        gasUsed: "45000",
        gasPrice: "25"
      },
      {
        hash: "0x9876543210fedcba9876543210fedcba98765432",
        type: "credential",
        amount: "0.01",
        currency: "ETH",
        status: "confirmed",
        timestamp: new Date(Date.now() - 7200000),
        gasUsed: "65000",
        gasPrice: "18",
        blockNumber: 18499850
      }
    ];
    
    setTransactions(mockTransactions);
  };

  const loadNFTCredentials = async (address: string) => {
    // Mock NFT credentials
    const mockCredentials: NFTCredential[] = [
      {
        tokenId: "1",
        name: "Verified Plumber",
        description: "Professional plumbing certification verified on blockchain",
        image: "/nft/plumber-cert.png",
        attributes: [
          { trait_type: "Skill Level", value: "Expert" },
          { trait_type: "Years Experience", value: 8 },
          { trait_type: "Certifications", value: 3 },
          { trait_type: "Rating", value: 4.9 }
        ],
        issuer: "Professional Services Alliance",
        issuedAt: "2024-01-15",
        verified: true
      },
      {
        tokenId: "2",
        name: "5-Star Service Provider",
        description: "Achievement NFT for maintaining 5-star rating",
        image: "/nft/5-star-badge.png",
        attributes: [
          { trait_type: "Rating", value: 5.0 },
          { trait_type: "Reviews", value: 150 },
          { trait_type: "Streak", value: "6 months" }
        ],
        issuer: "Loconomy Platform",
        issuedAt: "2024-02-01",
        verified: true
      }
    ];
    
    setNftCredentials(mockCredentials);
  };

  const loadReputation = async (address: string) => {
    // Mock reputation score calculation
    setReputation(4.8);
  };

  const loadSmartContracts = () => {
    const contracts: SmartContract[] = [
      {
        address: "0x742d35Cc6634C0532925a3b8D400297de9Fa0123",
        network: "ethereum",
        name: "LoconomyEscrow",
        version: "1.2.0",
        abi: [], // Would contain actual ABI
        verified: true
      },
      {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        network: "ethereum",
        name: "LoconomyCredentials",
        version: "1.1.0",
        abi: [], // Would contain actual ABI
        verified: true
      },
      {
        address: "0xA0b86a33E6441E616e83E8C96c3B9E13B0e5E4f1",
        network: "polygon",
        name: "LoconomyReviews",
        version: "1.0.5",
        abi: [], // Would contain actual ABI
        verified: true
      }
    ];
    
    setSmartContracts(contracts);
    setSelectedContract(contracts[0].address);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      loadWalletData(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Handle network change
    window.location.reload();
  };

  const createEscrow = async (amount: string, currency: string) => {
    if (!isConnected || !web3Ref.current) return;
    
    setIsLoading(true);
    try {
      const contract = new web3Ref.current.eth.Contract(
        [], // ABI would go here
        selectedContract
      );
      
      // Mock escrow creation
      const transaction: Web3Transaction = {
        hash: "0x" + Math.random().toString(16).substr(2, 40),
        type: "escrow",
        amount,
        currency,
        status: "pending",
        timestamp: new Date()
      };
      
      setTransactions(prev => [transaction, ...prev]);
      setEscrowBalance(amount);
      
      if (onTransaction) {
        onTransaction(transaction);
      }
      
      // Simulate confirmation after 3 seconds
      setTimeout(() => {
        setTransactions(prev => prev.map(t => 
          t.hash === transaction.hash 
            ? { ...t, status: "confirmed", blockNumber: 18500001 }
            : t
        ));
      }, 3000);
      
    } catch (error) {
      console.error("Error creating escrow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const releaseEscrow = async () => {
    if (!isConnected || !web3Ref.current) return;
    
    setIsLoading(true);
    try {
      const transaction: Web3Transaction = {
        hash: "0x" + Math.random().toString(16).substr(2, 40),
        type: "payment",
        amount: escrowBalance,
        currency: "USDC",
        status: "pending",
        timestamp: new Date()
      };
      
      setTransactions(prev => [transaction, ...prev]);
      setEscrowBalance("0");
      
      if (onTransaction) {
        onTransaction(transaction);
      }
      
    } catch (error) {
      console.error("Error releasing escrow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mintCredentialNFT = async (skillType: string) => {
    if (!isConnected || !web3Ref.current) return;
    
    setIsLoading(true);
    try {
      const transaction: Web3Transaction = {
        hash: "0x" + Math.random().toString(16).substr(2, 40),
        type: "credential",
        amount: "0.01",
        currency: "ETH",
        status: "pending",
        timestamp: new Date()
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      if (onTransaction) {
        onTransaction(transaction);
      }
      
    } catch (error) {
      console.error("Error minting credential NFT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stakeTokens = async (amount: string) => {
    if (!isConnected || !web3Ref.current) return;
    
    setIsLoading(true);
    try {
      const transaction: Web3Transaction = {
        hash: "0x" + Math.random().toString(16).substr(2, 40),
        type: "stake",
        amount,
        currency: "LOCO",
        status: "pending",
        timestamp: new Date()
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      if (onTransaction) {
        onTransaction(transaction);
      }
      
    } catch (error) {
      console.error("Error staking tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <UIIcons.CheckCircle className="w-4 h-4 text-green-500" / />;
      case "pending": return <OptimizedIcon name="Clock" className="w-4 h-4 text-yellow-500" />;
      case "failed": return <UIIcons.AlertTriangle className="w-4 h-4 text-red-500" / />;
      default: return <OptimizedIcon name="Clock" className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {t("title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Badge variant="default" className="bg-green-500">
                  <UIIcons.CheckCircle className="w-3 h-3 mr-1" / />
                  {t("connected")}
                </Badge>
                <Badge variant="outline">
                  {formatAddress(walletAddress || "")}
                </Badge>
              </>
            ) : (
              <Badge variant="secondary">
                {t("notConnected")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Wallet Connection */}
        {!isConnected ? (
          <Card className="text-center p-8">
            <CardContent>
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">{t("connectWallet")}</h3>
              <p className="text-gray-600 mb-6">{t("connectWalletDescription")}</p>
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Wallet className="w-4 h-4 mr-2" />
                )}
                {t("connectMetaMask")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="wallet">{t("wallet")}</TabsTrigger>
              <TabsTrigger value="escrow">{t("escrow")}</TabsTrigger>
              <TabsTrigger value="credentials">{t("credentials")}</TabsTrigger>
              <TabsTrigger value="reputation">{t("reputation")}</TabsTrigger>
              <TabsTrigger value="contracts">{t("contracts")}</TabsTrigger>
            </TabsList>

            {/* Wallet Tab */}
            <TabsContent value="wallet" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balances */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("balances")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(balance).map(([currency, amount]) => (
                      <div key={currency} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {currency.slice(0, 2)}
                          </div>
                          <span className="font-medium">{currency}</span>
                        </div>
                        <span className="text-lg font-semibold">{amount}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Wallet Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("actions")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => copyToClipboard(walletAddress || "")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t("copyAddress")}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {t("showQR")}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={disconnectWallet}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      {t("disconnect")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Network Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("network")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("currentNetwork")}</span>
                      <Badge variant="outline">Ethereum</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("gasPrice")}</span>
                      <span>20 Gwei</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("blockNumber")}</span>
                      <span>18,500,123</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("transactionHistory")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.hash} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <div className="font-medium capitalize">{transaction.type}</div>
                            <div className="text-sm text-gray-600">{formatAddress(transaction.hash)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{transaction.amount} {transaction.currency}</div>
                          <div className="text-sm text-gray-600">{transaction.timestamp.toLocaleTimeString()}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Escrow Tab */}
            <TabsContent value="escrow" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("createEscrow")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("amount")}</label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("currency")}</label>
                      <Select defaultValue="USDC">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="LOCO">LOCO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={() => createEscrow("100", "USDC")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t("createEscrow")}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("activeEscrow")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-8">
                      <div className="text-3xl font-bold text-violet-600 mb-2">
                        {escrowBalance} USDC
                      </div>
                      <p className="text-gray-600 mb-4">{t("lockedInEscrow")}</p>
                      
                      {parseFloat(escrowBalance) > 0 && (
                        <Button
                          onClick={releaseEscrow}
                          disabled={isLoading}
                          variant="outline"
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          {t("releaseEscrow")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nftCredentials.map((credential) => (
                  <Card key={credential.tokenId} className="overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 flex items-center justify-center text-white">
                      <Award className="w-16 h-16" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{credential.name}</h3>
                        {credential.verified && (
                          <Badge variant="default" className="bg-green-500">
                            <UIIcons.CheckCircle className="w-3 h-3 mr-1" / />
                            {t("verified")}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{credential.description}</p>
                      
                      <div className="space-y-1">
                        {credential.attributes.map((attr, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-gray-600">{attr.trait_type}:</span>
                            <span className="font-medium">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                        <div>{t("issuedBy")}: {credential.issuer}</div>
                        <div>{t("issuedOn")}: {credential.issuedAt}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Mint New Credential */}
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-semibold mb-2">{t("mintCredential")}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t("mintCredentialDescription")}</p>
                    <Button
                      onClick={() => mintCredentialNFT("electrical")}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      {t("mint")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reputation Tab */}
            <TabsContent value="reputation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("reputationScore")}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-8">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - reputation / 5)}`}
                          className="text-violet-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold">{reputation.toFixed(1)}</div>
                      </div>
                    </div>
                    <p className="text-gray-600">{t("outOf5Stars")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("stakeTokens")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{t("stakeDescription")}</p>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("stakeAmount")}</label>
                      <Input type="number" placeholder="100" />
                    </div>
                    
                    <Button
                      onClick={() => stakeTokens("100")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {t("stakeTokens")}
                    </Button>
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t("currentStake")}:</span>
                        <span>250 LOCO</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("rewardsEarned")}:</span>
                        <span>12.5 LOCO</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-6">
              <div className="space-y-4">
                {smartContracts.map((contract) => (
                  <Card key={contract.address}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{contract.name}</h3>
                          <p className="text-sm text-gray-600">v{contract.version}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{contract.network}</Badge>
                          {contract.verified && (
                            <Badge variant="default" className="bg-green-500">
                              <OptimizedIcon name="Shield" className="w-3 h-3 mr-1" />
                              {t("verified")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {formatAddress(contract.address)}
                        </code>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(contract.address)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://etherscan.io/address/${contract.address}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}