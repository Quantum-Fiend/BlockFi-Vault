import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
  Zap,
  Lock,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Activity,
  X,
  CheckCircle2,
  Menu,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// --- Types ---
type Asset = {
  id: string;
  name: string;
  sym: string;
  price: number;
  apr: number;
  color: string;
};

// --- Mock Data & Constants ---
const CHART_DATA = [
  { name: '01:00', tvl: 40.2 }, { name: '04:00', tvl: 41.5 },
  { name: '08:00', tvl: 39.8 }, { name: '12:00', tvl: 42.1 },
  { name: '16:00', tvl: 43.5 }, { name: '20:00', tvl: 42.8 },
  { name: '24:00', tvl: 45.2 },
];

const ASSETS: Asset[] = [
  { id: 'eth', name: 'Ethereum', sym: 'ETH', price: 2450.21, apr: 3.2, color: 'from-blue-500 to-cyan-400' },
  { id: 'usdc', name: 'USD Coin', sym: 'USDC', price: 1.00, apr: 5.4, color: 'from-blue-400 to-indigo-500' },
  { id: 'wbtc', name: 'Wrapped BTC', sym: 'WBTC', price: 64201.50, apr: 1.8, color: 'from-orange-500 to-yellow-600' },
];

// --- Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.4 }
  }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  })
};

function WalletSelectorModal({ isOpen, onClose, onConnect, onDisconnect, isConnected }: any) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-sm border-white/10 bg-slate-900 shadow-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase italic tracking-tight">Connect Identity</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {isConnected ? (
              <button onClick={onDisconnect} className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between hover:bg-red-500/20 transition-all text-red-500 font-bold">
                <span>Disconnect Wallet</span>
                <X size={16} />
              </button>
            ) : (
              <>
                <WalletOption name="MetaMask" icon="🦊" onClick={onConnect} />
                <WalletOption name="Coinbase" icon="🛡️" onClick={onConnect} />
                <WalletOption name="WalletConnect" icon="🌐" onClick={onConnect} />
              </>
            )}
          </div>

          <p className="mt-8 text-[10px] text-foreground/30 font-bold uppercase tracking-widest text-center">
            By connecting, you agree to Mesh protocol Terms.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WalletOption({ name, icon, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 hover:border-primary/20 transition-all group">
      <span className="text-2xl">{icon}</span>
      <span className="font-black uppercase tracking-tight italic text-foreground/60 group-hover:text-foreground">{name}</span>
    </button>
  );
}

// --- Modal Component ---
function ActionModal({
  isOpen,
  onClose,
  asset,
  type,
  onComplete
}: {
  isOpen: boolean,
  onClose: () => void,
  asset: Asset | null,
  type: 'Deposit' | 'Borrow' | 'Stake',
  onComplete: (amount: number) => void
}) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !asset) return null;

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please specify a valid amount');
      return;
    }
    setError('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onComplete(parseFloat(amount));
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-md border-primary/20 bg-slate-900/95 shadow-2xl"
        >
          {!isSuccess ? (
            <>
              <div className="flex justify-between items-center mb-8 px-8 pt-8">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">{type} {asset.sym}</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 px-8 pb-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-foreground/40 tracking-widest block mb-2">Amount to {type}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(''); }}
                      placeholder="0.00"
                      className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-2xl font-black focus:outline-none focus:border-primary transition`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 font-black">{asset.sym}</span>
                  </div>
                  {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">{error}</p>}
                </div>

                <div className="p-4 bg-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/40 font-bold">Protocol Fee</span>
                    <span className="font-black">0.02%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/40 font-bold">Estimated APR</span>
                    <span className="text-primary font-black">{asset.apr}%</span>
                  </div>
                </div>

                <button
                  disabled={isProcessing || !amount}
                  onClick={handleAction}
                  className="w-full btn-primary text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className={isProcessing ? 'opacity-0' : ''}>Confirm {type}</span>
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="animate-spin" />
                    </div>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <CheckCircle2 className="text-primary w-12 h-12" />
              </motion.div>
              <h3 className="text-2xl font-black uppercase italic">Transaction Success</h3>
              <p className="text-foreground/40 text-sm font-medium px-8 text-center">Vault balance updated successfully and saved to mesh identity.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWalletConnected, setIsWalletConnected] = useState(() => {
    return localStorage.getItem('blockfi_wallet_connected') === 'true';
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('blockfi_vault_balance');
    return saved ? JSON.parse(saved) : { deps: 2450.00, borrow: 0.00, staking: 120.50 };
  });
  const [transactions, setTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('blockfi_vault_txs');
    return saved ? JSON.parse(saved) : [
      { type: 'Deposit', asset: 'ETH', amount: '12.00', time: '2m ago' },
      { type: 'Borrow', asset: 'USDC', amount: '45,000', time: '15m ago' },
      { type: 'Stake', asset: 'BVF', amount: '1,500', time: '1h ago' }
    ];
  });
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalType, setModalType] = useState<'Deposit' | 'Borrow' | 'Stake' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('blockfi_vault_balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('blockfi_vault_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('blockfi_wallet_connected', String(isWalletConnected));
  }, [isWalletConnected]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (asset: Asset, type: 'Deposit' | 'Borrow' | 'Stake') => {
    setSelectedAsset(asset);
    setModalType(type);
  };

  const handleComplete = (amount: number) => {
    const newTx = {
      type: modalType,
      asset: selectedAsset?.sym || 'BVF',
      amount: amount.toLocaleString(),
      time: 'Just now'
    };

    setTransactions(prev => [newTx, ...prev].slice(0, 10));

    if (modalType === 'Deposit') {
      setBalance((prev: any) => ({ ...prev, deps: prev.deps + (amount * (selectedAsset?.price || 1)) }));
    } else if (modalType === 'Borrow') {
      setBalance((prev: any) => ({ ...prev, borrow: prev.borrow + (amount * (selectedAsset?.price || 1)) }));
    } else if (modalType === 'Stake') {
      setBalance((prev: any) => ({ ...prev, staking: prev.staking + amount }));
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen selection:bg-primary selection:text-background font-sans">
      <ActionModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        asset={selectedAsset}
        type={modalType || 'Deposit'}
        onComplete={handleComplete}
      />

      <nav className="nav-blur border-b border-white/5 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setActiveTab('overview')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/10">
              <ShieldCheck className="text-black w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-black gradient-text tracking-tighter leading-none">BLOCKFI VAULT</h1>
              <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.3em]">Institutional Mesh</span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <NavTab label="Overview" icon={<LayoutDashboard size={16} />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavTab label="Markets" icon={<Activity size={16} />} active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
            <NavTab label="Governance" icon={<Lock size={16} />} active={activeTab === 'staking'} onClick={() => setActiveTab('staking')} />
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsWalletModalOpen(true)}
              className={`btn-primary flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 ${isWalletConnected ? 'filter grayscale brightness-75' : ''}`}
            >
              <Wallet size={18} />
              <span className="font-bold text-sm md:text-base">{isWalletConnected ? '0x81F2...D92A' : 'Access Vault'}</span>
              {isWalletConnected && <ChevronDown size={14} className="opacity-40" />}
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <WalletSelectorModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={() => { setIsWalletConnected(true); setIsWalletModalOpen(false); }}
        onDisconnect={() => { setIsWalletConnected(false); setIsWalletModalOpen(false); }}
        isConnected={isWalletConnected}
      />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="text-primary w-8 h-8" />
                  <h2 className="text-2xl font-black gradient-text tracking-tighter">VAULT MENU</h2>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <MobileNavItem label="Dashboard Overview" icon={<LayoutDashboard />} active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Institutional Markets" icon={<Activity />} active={activeTab === 'vault'} onClick={() => { setActiveTab('vault'); setIsMenuOpen(false); }} />
                <MobileNavItem label="Mesh Governance" icon={<Lock />} active={activeTab === 'staking'} onClick={() => { setActiveTab('staking'); setIsMenuOpen(false); }} />
              </div>

              <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4 text-center">Protocol Identity</p>
                <div className="flex items-center justify-center gap-4 grayscale opacity-50">
                  <ShieldCheck size={20} />
                  <Zap size={20} />
                  <Activity size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {activeTab === 'overview' && <OverviewView balance={balance} transactions={transactions} onQuickAction={(type: 'Deposit' | 'Borrow') => openModal(ASSETS[0], type)} />}
            {activeTab === 'vault' && <VaultView onAction={openModal} />}
            {activeTab === 'staking' && <StakingView balance={balance} onStake={() => openModal({ id: 'bvf', name: 'BlockFi Token', sym: 'BVF', price: 17.42, apr: 24.5, color: 'from-primary to-secondary' }, 'Stake')} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10 bg-gradient-to-b from-secondary/10 to-transparent"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
    </div>
  );
}

// --- View Components ---

function MobileNavItem({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-6 p-6 rounded-3xl border transition-all ${active ? 'bg-primary/10 border-primary/20 text-foreground' : 'bg-white/5 border-white/5 text-foreground/40'}`}
    >
      <div className={`${active ? 'text-primary' : ''}`}>
        {icon}
      </div>
      <span className="text-lg font-black uppercase tracking-tight italic">{label}</span>
    </button>
  );
}

function NavTab({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${active ? 'text-foreground' : 'text-foreground/40 hover:text-foreground'
        }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function OverviewView({ balance, transactions, onQuickAction }: any) {
  return (
    <div className="space-y-12">
      <header>
        <motion.h2
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight"
        >
          Yield Intelligence. <span className="text-primary underline decoration-primary/20 underline-offset-8">Defined.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-foreground/50 text-xl max-w-2xl font-medium"
        >
          Optimized liquidity protocols for high-net-worth decentralized portfolios.
          Real-time TVL: <span className="text-secondary font-bold">$45,291,002</span>
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={0} title="Total Value Locked" value="$45.2M" sub="+12.4%" icon={<Coins className="text-primary" />} />
        <StatCard delay={1} title="Market Utilization" value="84.2%" sub="High" icon={<Activity className="text-secondary" />} />
        <StatCard delay={2} title="Staking Index" value="1.042x" sub="BVF" icon={<Lock className="text-accent" />} />
        <StatCard delay={3} title="Net Worth" value={`$${balance.deps.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Simulated" icon={<ShieldCheck className="text-white" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <motion.div
          variants={cardVariants} custom={4} initial="initial" animate="enter"
          className="glass-card h-[450px]"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight uppercase italic">Protocol Gravity Analytics</h3>
              <p className="text-xs text-foreground/40 uppercase font-black tracking-widest">Growth Vector / Institutional Grade</p>
            </div>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64FFDA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#64FFDA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(100,255,218,0.2)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="tvl" stroke="#64FFDA" fill="url(#pGrad)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction label="Instant Deposit" desc="Max Yield" color="bg-primary/10" icon={<ArrowDownLeft className="text-primary" />} onClick={() => onQuickAction('Deposit')} />
        <QuickAction label="Collateral Loan" desc="1.5x Multiplier" color="bg-secondary/10" icon={<TrendingUp className="text-secondary" />} onClick={() => onQuickAction('Borrow')} />
        <QuickAction label="Harvest Rewards" desc="Auto-Compounding" color="bg-accent/10" icon={<Zap className="text-accent" />} onClick={() => { }} />
      </div>

      <motion.div
        variants={cardVariants} custom={6} initial="initial" animate="enter"
        className="glass-card !p-0 overflow-hidden border-white/5"
      >
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tight">Recent Activity</h3>
            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">Global Protocol Pulse</p>
          </div>
          <Activity className="text-primary/40 animate-pulse" size={20} />
        </div>
        <div className="divide-y divide-white/5">
          {transactions.map((tx: any, i: number) => (
            <ActivityRow key={i} {...tx} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ActivityRow({ type, asset, amount, time }: any) {
  return (
    <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors">
          {type === 'Deposit' ? <ArrowDownLeft size={14} className="text-primary" /> : type === 'Borrow' ? <ArrowUpRight size={14} className="text-secondary" /> : <Lock size={14} className="text-accent" />}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-tight">{type} {asset}</p>
          <p className="text-[10px] text-foreground/30 font-bold">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-black stat-value">{amount} {asset}</p>
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Verified</p>
      </div>
    </div>
  );
}

function VaultView({ onAction }: { onAction: (asset: Asset, type: 'Deposit' | 'Borrow') => void }) {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black tracking-tight mb-2 uppercase italic">Institutional Markets</h2>
        <p className="text-foreground/40 font-medium tracking-wide">Liquidity Pools optimized for security and capital efficiency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <MarketTable title="Lending Pools" subtitle="Supply assets and earn passive yield" type="Deposit" onAction={onAction} />
        <MarketTable title="Borrowing Hub" subtitle="Leverage assets for instant liquidity" type="Borrow" onAction={onAction} />
      </div>
    </div>
  );
}

function StakingView({ balance, onStake }: any) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">Stake <span className="text-primary">BVF</span></h2>
        <p className="text-foreground/40 text-lg font-medium">Earn institutional-grade rewards through protocol revenue sharing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div whileHover={{ y: -5 }} className="glass-card flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black mb-10 flex items-center gap-2">
              <Lock size={24} className="text-primary" /> Staking Pool
            </h3>
            <div className="mb-10 p-8 bg-black/30 rounded-2xl border border-white/5 text-center shadow-inner">
              <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">My Staked BVF</p>
              <p className="text-6xl font-black stat-value mb-1 font-mono tracking-tighter">{balance.staking.toFixed(2)}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">Active Balance</p>
            </div>
          </div>
          <button onClick={onStake} className="w-full btn-primary text-xl py-5 flex items-center justify-center gap-3">
            <Zap size={20} />
            Add to Position
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card border-secondary/20">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-2">
            <TrendingUp size={24} className="text-secondary" /> Estimated Yields
          </h3>
          <div className="space-y-6">
            <RewardRow label="BVF Distributed" value="1,204" sym="BVF" />
            <RewardRow label="Real Yield (USDC)" value="452" sym="USDC" />
            <div className="pt-6 border-t border-white/5">
              <button className="w-full btn-secondary py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                <RefreshCw size={14} />
                Compound All
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Atomic UI Helpers ---

function StatCard({ title, value, sub, icon, delay }: any) {
  return (
    <motion.div
      variants={cardVariants} custom={delay} initial="initial" animate="enter"
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card !p-6 flex flex-col justify-between group h-40"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors shadow-inner">
          {icon}
        </div>
        <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-md text-primary tracking-widest group-hover:bg-primary group-hover:text-black transition-all">
          {sub}
        </span>
      </div>
      <div>
        <h5 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{title}</h5>
        <p className="text-3xl font-black tracking-tighter stat-value">{value}</p>
      </div>
    </motion.div>
  );
}

function MarketTable({ title, subtitle, type, onAction }: { title: string, subtitle: string, type: 'Deposit' | 'Borrow', onAction: (asset: Asset, type: 'Deposit' | 'Borrow') => void }) {
  return (
    <div className="glass-card !p-0 overflow-hidden border-white/5 shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-white/[0.02]">
        <h3 className="text-2xl font-black mb-1 uppercase tracking-tight italic">{title}</h3>
        <p className="text-xs text-foreground/40 font-medium tracking-wide">{subtitle}</p>
      </div>
      <div className="divide-y divide-white/5">
        {ASSETS.map((asset, i) => (
          <motion.div
            key={asset.id} custom={i} variants={cardVariants} initial="initial" animate="enter"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            className="p-6 flex justify-between items-center group cursor-pointer"
            onClick={() => onAction(asset, type)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${asset.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                <span className="text-black font-black text-xs">{asset.sym}</span>
              </div>
              <div>
                <p className="font-black text-lg leading-none mb-1 uppercase italic tracking-tighter">{asset.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#64FFDA]"></div>
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Yield: {asset.apr}%</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div className="hidden sm:block w-32">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest whitespace-nowrap">Market Load</p>
                  <p className="text-[10px] font-black text-primary/60 uppercase">74%</p>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '74%' }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <ChevronRight className="text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RewardRow({ label, value, sym }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{label}</span>
        <span className="text-xl font-black stat-value uppercase tracking-tighter">{value} <span className="text-foreground/30 text-sm font-mono">{sym}</span></span>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-lg text-primary/40 hover:text-primary transition-all">
        <ExternalLink size={16} />
      </button>
    </div>
  );
}

function QuickAction({ label, desc, color, icon, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 glass-card border-transparent hover:border-white/10 transition-all group text-left"
    >
      <div className={`p-4 ${color} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-black text-lg tracking-tight leading-none mb-1 uppercase italic">{label}</p>
        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{desc}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
        <ArrowUpRight className="text-foreground/20 group-hover:text-primary transition-all" size={16} />
      </div>
    </motion.button>
  );
}

export default App;
