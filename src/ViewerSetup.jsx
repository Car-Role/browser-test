import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Twitch,
  MessageSquare,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Link2,
  Unlink,
  PartyPopper,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function ConnectionCard({ platform, connected, username, onConnect, onDisconnect, loading }) {
  const config = {
    twitch: {
      name: 'Twitch',
      icon: Twitch,
      color: '#9146FF',
      bgColor: 'bg-[#9146FF]',
      hoverColor: 'hover:bg-[#7c3aed]',
      borderColor: 'border-[#9146FF]/30',
      textColor: 'text-[#9146FF]',
    },
    discord: {
      name: 'Discord',
      icon: MessageSquare,
      color: '#5865F2',
      bgColor: 'bg-[#5865F2]',
      hoverColor: 'hover:bg-[#4752C4]',
      borderColor: 'border-[#5865F2]/30',
      textColor: 'text-[#5865F2]',
    },
  };

  const { name, icon: Icon, bgColor, hoverColor, borderColor, textColor } = config[platform];

  return (
    <div
      className={cn(
        'p-6 rounded-2xl border transition-all',
        connected
          ? `bg-emerald-500/5 border-emerald-500/30`
          : `bg-[#18181b]/50 ${borderColor}`
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              connected ? 'bg-emerald-500/20' : `${bgColor}/20`
            )}
          >
            <Icon className={cn('w-6 h-6', connected ? 'text-emerald-400' : textColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            {connected ? (
              <p className="text-sm text-emerald-400">{username}</p>
            ) : (
              <p className="text-sm text-zinc-500">Not connected</p>
            )}
          </div>
        </div>
        {connected && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
      </div>

      {connected ? (
        <button
          onClick={onDisconnect}
          className="w-full py-3 rounded-xl bg-[#27272a]/50 border border-[#3f3f46] text-zinc-400 hover:text-red-400 hover:border-red-500/30 font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Unlink className="w-4 h-4" />
          Disconnect
        </button>
      ) : (
        <button
          onClick={onConnect}
          disabled={loading}
          className={cn(
            'w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50',
            bgColor,
            hoverColor
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Link2 className="w-5 h-5" />
              Connect {name}
            </>
          )}
        </button>
      )}
    </div>
  );
}

function StatusBanner({ twitchConnected, discordConnected }) {
  const bothConnected = twitchConnected && discordConnected;
  const oneConnected = twitchConnected || discordConnected;

  if (bothConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-medium text-emerald-400">You're ready to play!</p>
          <p className="text-sm text-zinc-400">
            Type <code className="px-1 py-0.5 rounded bg-[#27272a] text-[#9146FF]">!join</code> in any ViewerQ-enabled stream to join their queue.
          </p>
        </div>
      </motion.div>
    );
  }

  if (oneConnected) {
    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-medium text-amber-400">Almost there!</p>
          <p className="text-sm text-zinc-400">
            Connect {!twitchConnected ? 'Twitch' : 'Discord'} to complete your setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-[#27272a]/50 border border-[#3f3f46] flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center">
        <Link2 className="w-5 h-5 text-zinc-500" />
      </div>
      <div>
        <p className="font-medium text-zinc-300">Link your accounts</p>
        <p className="text-sm text-zinc-500">Connect both Twitch and Discord to join games.</p>
      </div>
    </div>
  );
}

function ReadyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      {/* Celebration Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9146FF]/20 to-[#5865F2]/20 flex items-center justify-center mx-auto mb-6"
      >
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <PartyPopper className="w-12 h-12 text-[#9146FF]" />
        </motion.div>
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto">
        Your accounts are linked. You can now join any ViewerQ-enabled stream's queue.
      </p>

      {/* How to Join */}
      <div className="p-6 rounded-2xl bg-[#18181b]/50 border border-[#27272a] text-left max-w-md mx-auto">
        <h3 className="font-semibold text-white mb-4">How to join a game:</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9146FF]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#9146FF]">1</span>
            </div>
            <div>
              <p className="text-sm text-zinc-300">Find a stream using ViewerQ</p>
              <p className="text-xs text-zinc-500">Look for streams with viewer games</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9146FF]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#9146FF]">2</span>
            </div>
            <div>
              <p className="text-sm text-zinc-300">
                Type <code className="px-1.5 py-0.5 rounded bg-[#27272a] text-[#9146FF] font-mono">!join</code> in chat
              </p>
              <p className="text-xs text-zinc-500">You'll be added to the queue</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#5865F2]">3</span>
            </div>
            <div>
              <p className="text-sm text-zinc-300">Get a Discord invite when selected</p>
              <p className="text-xs text-zinc-500">Join the voice channel and play!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <a
        href="#"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46] font-medium transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </a>
    </motion.div>
  );
}

// Main Viewer Setup Component
function ViewerSetup() {
  const [twitchConnected, setTwitchConnected] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [twitchLoading, setTwitchLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [twitchUsername, setTwitchUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');

  const handleConnectTwitch = () => {
    setTwitchLoading(true);
    // Simulate OAuth
    setTimeout(() => {
      setTwitchLoading(false);
      setTwitchConnected(true);
      setTwitchUsername('CoolViewer123');
    }, 1500);
  };

  const handleConnectDiscord = () => {
    setDiscordLoading(true);
    // Simulate OAuth
    setTimeout(() => {
      setDiscordLoading(false);
      setDiscordConnected(true);
      setDiscordUsername('CoolViewer#1234');
    }, 1500);
  };

  const handleDisconnectTwitch = () => {
    setTwitchConnected(false);
    setTwitchUsername('');
  };

  const handleDisconnectDiscord = () => {
    setDiscordConnected(false);
    setDiscordUsername('');
  };

  const bothConnected = twitchConnected && discordConnected;

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[10%] w-[40vw] h-[40vw] bg-[#5865F2]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[30vw] h-[30vw] bg-[#9146FF]/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#9146FF] to-[#5865F2] rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">ViewerQ</span>
            </a>
            <span className="text-sm text-zinc-500">Viewer Setup</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {bothConnected ? (
            <ReadyState />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9146FF]/20 to-[#5865F2]/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#9146FF]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Link Your Accounts</h1>
                <p className="text-zinc-400">
                  Connect your Twitch and Discord to join viewer games.
                </p>
              </div>

              {/* Status Banner */}
              <StatusBanner
                twitchConnected={twitchConnected}
                discordConnected={discordConnected}
              />

              {/* Connection Cards */}
              <div className="space-y-4">
                <ConnectionCard
                  platform="twitch"
                  connected={twitchConnected}
                  username={twitchUsername}
                  onConnect={handleConnectTwitch}
                  onDisconnect={handleDisconnectTwitch}
                  loading={twitchLoading}
                />
                <ConnectionCard
                  platform="discord"
                  connected={discordConnected}
                  username={discordUsername}
                  onConnect={handleConnectDiscord}
                  onDisconnect={handleDisconnectDiscord}
                  loading={discordLoading}
                />
              </div>

              {/* Info */}
              <div className="p-4 rounded-xl bg-[#27272a]/30 border border-[#3f3f46]">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Why do I need both?</h4>
                <p className="text-sm text-zinc-500">
                  Twitch identifies you in the queue. Discord lets you receive voice channel invites when you're selected to play.
                </p>
              </div>

              {/* Back Link */}
              <div className="text-center pt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ViewerSetup;
