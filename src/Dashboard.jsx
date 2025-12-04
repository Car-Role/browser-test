import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Square,
  Users,
  Shuffle,
  ListOrdered,
  Settings,
  Trash2,
  Copy,
  ExternalLink,
  X,
  RefreshCw,
  UserX,
  Clock,
  Crown,
  Star,
  Gamepad2,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Twitch,
  MessageSquare,
  Volume2,
  Link2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const mockQueueViewers = [
  { id: 1, username: 'CoolGamer42', badges: ['SUB'], joinedAt: new Date(Date.now() - 120000) },
  { id: 2, username: 'StreamFan99', badges: ['VIP', 'SUB'], joinedAt: new Date(Date.now() - 90000) },
  { id: 3, username: 'ProPlayer_X', badges: [], joinedAt: new Date(Date.now() - 60000) },
  { id: 4, username: 'TwitchViewer', badges: ['SUB'], joinedAt: new Date(Date.now() - 45000) },
  { id: 5, username: 'GameLover2024', badges: [], joinedAt: new Date(Date.now() - 30000) },
];

const mockSessionParticipants = [
  { id: 1, username: 'CoolGamer42', discordLinked: true, inVoice: true, discordUsername: 'CoolGamer#1234' },
  { id: 2, username: 'StreamFan99', discordLinked: true, inVoice: true, discordUsername: 'StreamFan#5678' },
  { id: 3, username: 'ProPlayer_X', discordLinked: true, inVoice: false, discordUsername: 'ProPlayer#9012' },
  { id: 4, username: 'TwitchViewer', discordLinked: false, inVoice: false, discordUsername: null },
];

// --- Sub-components ---

function Badge({ type }) {
  const styles = {
    SUB: 'bg-[#9146FF]/20 text-[#9146FF] border-[#9146FF]/30',
    VIP: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  const icons = {
    SUB: <Star className="w-3 h-3" />,
    VIP: <Crown className="w-3 h-3" />,
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border',
      styles[type]
    )}>
      {icons[type]}
      {type}
    </span>
  );
}

function StatusPill({ active }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border',
      active
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50'
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
      )} />
      {active ? 'Queue Active' : 'Queue Inactive'}
    </div>
  );
}

function ConnectionStatus({ status }) {
  const config = {
    connected: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: 'In Voice',
      className: 'text-emerald-400',
    },
    waiting: {
      icon: <Clock className="w-4 h-4" />,
      text: 'Waiting to Join',
      className: 'text-amber-400',
    },
    noDiscord: {
      icon: <XCircle className="w-4 h-4" />,
      text: 'No Discord Linked',
      className: 'text-red-400',
    },
  };

  const { icon, text, className } = config[status];

  return (
    <div className={cn('flex items-center gap-1.5 text-xs font-medium', className)}>
      {icon}
      {text}
    </div>
  );
}

function QueueViewerRow({ viewer, position }) {
  const timeAgo = Math.floor((Date.now() - viewer.joinedAt.getTime()) / 1000);
  const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center justify-between p-3 rounded-lg bg-[#27272a]/30 border border-[#27272a]/50 hover:bg-[#27272a]/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center text-sm font-bold text-zinc-500">
          {position}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{viewer.username}</span>
            {viewer.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <Clock className="w-3 h-3" />
            {timeStr}
          </div>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function SessionParticipantRow({ participant, onResendInvite, onKick }) {
  const status = !participant.discordLinked
    ? 'noDiscord'
    : participant.inVoice
    ? 'connected'
    : 'waiting';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#27272a]/30 border border-[#27272a]/50">
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          status === 'connected' ? 'bg-emerald-500/20' : status === 'waiting' ? 'bg-amber-500/20' : 'bg-red-500/20'
        )}>
          {status === 'connected' ? (
            <Mic className="w-5 h-5 text-emerald-400" />
          ) : status === 'waiting' ? (
            <MicOff className="w-5 h-5 text-amber-400" />
          ) : (
            <Link2 className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Twitch className="w-4 h-4 text-[#9146FF]" />
            <span className="text-sm font-medium text-white">{participant.username}</span>
          </div>
          {participant.discordUsername && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
              <MessageSquare className="w-3 h-3 text-[#5865F2]" />
              {participant.discordUsername}
            </div>
          )}
          <ConnectionStatus status={status} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === 'waiting' && (
          <button
            onClick={() => onResendInvite?.(participant.id)}
            className="p-2 rounded-lg bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30 transition-colors"
            title="Resend Invite"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onKick?.(participant.id)}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          title="Kick from Session"
        >
          <UserX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyQueueState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#27272a]/50 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-400 mb-2">No viewers in queue</h3>
      <p className="text-sm text-zinc-600 max-w-xs">
        Viewers can join by typing <code className="px-1.5 py-0.5 rounded bg-[#27272a] text-[#9146FF] font-mono text-xs">!join</code> in your Twitch chat.
      </p>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText, variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 mb-6">{description}</p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              variant === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#9146FF] text-white hover:bg-[#7c3aed]'
            )}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Dashboard Component ---

function Dashboard() {
  const [queueActive, setQueueActive] = useState(true);
  const [partySize, setPartySize] = useState(4);
  const [selectionMode, setSelectionMode] = useState('random'); // 'queue' | 'random'
  const [queueViewers, setQueueViewers] = useState(mockQueueViewers);
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionParticipants, setSessionParticipants] = useState(mockSessionParticipants);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const streamerName = 'StreamerPro';

  const handleToggleQueue = () => {
    setQueueActive(!queueActive);
  };

  const handlePullViewers = () => {
    // In real app, this would trigger the Discord flow
    console.log(`Pulling ${partySize} viewers using ${selectionMode} mode`);
  };

  const handleClearQueue = () => {
    setQueueViewers([]);
    setShowClearConfirm(false);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setSessionParticipants([]);
    setShowEndSessionConfirm(false);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText('https://discord.gg/example-invite');
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const connectedCount = sessionParticipants.filter((p) => p.inVoice).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[5%] w-[30vw] h-[30vw] bg-[#9146FF]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[25vw] h-[25vw] bg-[#5865F2]/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[#9146FF] to-[#5865F2] rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight group-hover:text-[#9146FF] transition-colors">ViewerQ</span>
              </a>
              <div className="hidden sm:block h-6 w-px bg-[#27272a]" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-zinc-500">
                  Welcome back, <span className="text-[#9146FF]">{streamerName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusPill active={queueActive} />
              <a
                href="#settings"
                className="p-2 rounded-lg bg-[#27272a]/50 text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
              >
                <Settings className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Queue Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Queue Toggle Card */}
            <div className="p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a]">
              <h2 className="text-lg font-semibold mb-4">Queue Control</h2>
              <button
                onClick={handleToggleQueue}
                className={cn(
                  'w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all',
                  queueActive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                )}
              >
                {queueActive ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop Queue
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Queue
                  </>
                )}
              </button>
            </div>

            {/* Pull Settings Card */}
            <div className="p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a]">
              <h2 className="text-lg font-semibold mb-4">Pull Settings</h2>

              {/* Party Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Party Size</label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={cn(
                        'flex-1 py-2 rounded-lg font-semibold text-sm transition-all',
                        partySize === size
                          ? 'bg-[#9146FF] text-white'
                          : 'bg-[#27272a]/50 text-zinc-400 hover:bg-[#27272a] hover:text-white'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Selection Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectionMode('queue')}
                    className={cn(
                      'py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
                      selectionMode === 'queue'
                        ? 'bg-[#9146FF] text-white'
                        : 'bg-[#27272a]/50 text-zinc-400 hover:bg-[#27272a] hover:text-white'
                    )}
                  >
                    <ListOrdered className="w-4 h-4" />
                    First in Queue
                  </button>
                  <button
                    onClick={() => setSelectionMode('random')}
                    className={cn(
                      'py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
                      selectionMode === 'random'
                        ? 'bg-[#9146FF] text-white'
                        : 'bg-[#27272a]/50 text-zinc-400 hover:bg-[#27272a] hover:text-white'
                    )}
                  >
                    <Shuffle className="w-4 h-4" />
                    Random
                  </button>
                </div>
              </div>

              {/* Pull Button */}
              <button
                onClick={handlePullViewers}
                disabled={queueViewers.length === 0}
                className={cn(
                  'w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all',
                  queueViewers.length > 0
                    ? 'bg-[#9146FF] text-white hover:bg-[#7c3aed] hover:shadow-[0_0_20px_-5px_rgba(145,70,255,0.5)]'
                    : 'bg-[#27272a] text-zinc-600 cursor-not-allowed'
                )}
              >
                <Users className="w-5 h-5" />
                Pull {partySize} Viewers
              </button>
            </div>
          </div>

          {/* Right Column - Queue List & Session */}
          <div className="lg:col-span-8 space-y-6">
            {/* Queue List Card */}
            <div className="p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">Queue</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#27272a] text-sm font-medium text-zinc-400">
                    {queueViewers.length} viewer{queueViewers.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {queueViewers.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {queueViewers.length === 0 ? (
                <EmptyQueueState />
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {queueViewers.map((viewer, index) => (
                      <QueueViewerRow key={viewer.id} viewer={viewer} position={index + 1} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Current Session Card */}
            {sessionActive && sessionParticipants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-[#5865F2]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Current Session</h2>
                      <p className="text-sm text-zinc-500">
                        <span className="text-emerald-400">{connectedCount}</span> of {sessionParticipants.length} in voice
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyInvite}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        inviteCopied
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#27272a]/50 text-zinc-400 hover:bg-[#27272a] hover:text-white'
                      )}
                    >
                      {inviteCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {inviteCopied ? 'Copied!' : 'Copy Invite'}
                    </button>
                    <a
                      href="https://discord.com/channels/@me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Discord
                    </a>
                    <button
                      onClick={() => setShowEndSessionConfirm(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      End Session
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sessionParticipants.map((participant) => (
                    <SessionParticipantRow
                      key={participant.id}
                      participant={participant}
                      onResendInvite={(id) => console.log('Resend invite to', id)}
                      onKick={(id) => console.log('Kick', id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modals */}
      <AnimatePresence>
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearQueue}
          title="Clear Queue?"
          description="This will remove all viewers from the queue. They will need to type !join again to re-enter."
          confirmText="Clear Queue"
          variant="danger"
        />
        <ConfirmModal
          isOpen={showEndSessionConfirm}
          onClose={() => setShowEndSessionConfirm(false)}
          onConfirm={handleEndSession}
          title="End Session?"
          description="This will close the voice channel and remove all participants. You can start a new session by pulling more viewers."
          confirmText="End Session"
          variant="danger"
        />
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
