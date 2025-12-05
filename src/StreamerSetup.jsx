import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Twitch,
  MessageSquare,
  Bot,
  Gamepad2,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const STEPS = [
  { id: 'twitch', title: 'Connect Twitch', icon: Twitch },
  { id: 'discord', title: 'Configure Discord', icon: MessageSquare },
  { id: 'bot', title: 'Add Bot', icon: Bot },
  { id: 'ready', title: 'Ready to Go', icon: Zap },
];

function StepIndicator({ steps, currentStep }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                  isComplete
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-[#9146FF] text-white'
                    : 'bg-[#27272a] text-zinc-500'
                )}
              >
                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isCurrent ? 'text-white' : 'text-zinc-500'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 h-0.5 mb-6 sm:mb-0',
                  index < currentIndex ? 'bg-emerald-500' : 'bg-[#27272a]'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepCard({ children, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="p-8 rounded-2xl bg-[#18181b]/80 border border-[#27272a] backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-zinc-400 mb-6">{description}</p>
        {children}
      </div>
    </motion.div>
  );
}

// Step 1: Connect Twitch
function TwitchStep({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setLoading(false);
      setConnected(true);
    }, 1500);
  };

  return (
    <StepCard
      title="Connect Your Twitch"
      description="Link your Twitch account so ViewerQ can manage your channel's queue."
    >
      {!connected ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Twitch className="w-5 h-5" />
              Connect with Twitch
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-emerald-400">Twitch Connected!</p>
              <p className="text-sm text-zinc-400">Logged in as StreamerPro</p>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </StepCard>
  );
}

// Step 2: Configure Discord Server
function DiscordStep({ onComplete, onBack }) {
  const [serverId, setServerId] = useState('');
  const [serverName, setServerName] = useState('');
  const [loading, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!serverId.trim()) {
      setError('Please enter your Discord Server ID');
      return;
    }
    if (!/^\d{17,19}$/.test(serverId.trim())) {
      setError('Invalid Server ID format. It should be a 17-19 digit number.');
      return;
    }

    setError('');
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 1000);
  };

  return (
    <StepCard
      title="Configure Discord Server"
      description="Enter your Discord server details so ViewerQ can create voice channels for your games."
    >
      <div className="space-y-4">
        {/* Server ID Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Discord Server ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            placeholder="e.g., 123456789012345678"
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-[#27272a]/50 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-all',
              error ? 'border-red-500' : 'border-[#3f3f46]'
            )}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {/* Server Name Input (Optional) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Server Name <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder="e.g., My Gaming Community"
            className="w-full px-4 py-3 rounded-xl bg-[#27272a]/50 border border-[#3f3f46] text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-all"
          />
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-[#27272a]/50 border border-[#3f3f46]">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">How to find your Server ID:</h4>
          <ol className="text-sm text-zinc-500 space-y-1 list-decimal list-inside">
            <li>Open Discord and go to User Settings</li>
            <li>Navigate to Advanced and enable Developer Mode</li>
            <li>Right-click your server icon and select "Copy Server ID"</li>
          </ol>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-emerald-400">Discord server configured!</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-xl bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46] font-medium flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {!saved ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Save Discord Server
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex-1 py-3 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </StepCard>
  );
}

// Step 3: Add Bot to Server
function BotStep({ onComplete, onBack }) {
  const [botAdded, setBotAdded] = useState(false);
  const [checking, setChecking] = useState(false);

  const botInviteUrl = 'https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(botInviteUrl);
  };

  const handleCheckBot = () => {
    setChecking(true);
    // Simulate checking if bot is in server
    setTimeout(() => {
      setChecking(false);
      setBotAdded(true);
    }, 2000);
  };

  return (
    <StepCard
      title="Add ViewerQ Bot"
      description="Add our Discord bot to your server so it can create voice channels and send invites."
    >
      <div className="space-y-4">
        {/* Bot Card */}
        <div className="p-4 rounded-xl bg-[#27272a]/50 border border-[#3f3f46] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9146FF] to-[#5865F2] flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white">ViewerQ Bot</h4>
            <p className="text-sm text-zinc-500">Manages voice channels & invites</p>
          </div>
        </div>

        {/* Add Bot Button */}
        <a
          href={botInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Add Bot to Discord
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full py-3 rounded-xl bg-[#27272a]/50 border border-[#3f3f46] text-zinc-300 hover:bg-[#27272a] font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Copy className="w-4 h-4" />
          Copy Invite Link
        </button>

        {/* Permissions Warning */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-400">Required Permissions</h4>
              <p className="text-sm text-zinc-400 mt-1">
                The bot needs permission to create channels, manage voice, and send messages. Make sure to accept all requested permissions.
              </p>
            </div>
          </div>
        </div>

        {botAdded && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-emerald-400">Bot detected in your server!</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-xl bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46] font-medium flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={botAdded ? onComplete : handleCheckBot}
            disabled={checking}
            className="flex-1 py-3 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : botAdded ? (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                I've Added the Bot
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </StepCard>
  );
}

// Step 4: Ready to Go
function ReadyStep() {
  return (
    <StepCard
      title="You're All Set!"
      description="Your ViewerQ setup is complete. You're ready to start playing with your viewers."
    >
      <div className="space-y-6">
        {/* Success Animation */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {[
            { icon: Twitch, text: 'Twitch account connected', color: 'text-[#9146FF]' },
            { icon: MessageSquare, text: 'Discord server configured', color: 'text-[#5865F2]' },
            { icon: Bot, text: 'ViewerQ bot added', color: 'text-emerald-400' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#27272a]/30"
            >
              <item.icon className={cn('w-5 h-5', item.color)} />
              <span className="text-zinc-300">{item.text}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
            </motion.div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="p-4 rounded-xl bg-[#27272a]/50 border border-[#3f3f46]">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">What's next?</h4>
          <ul className="text-sm text-zinc-500 space-y-1">
            <li>• Start your queue from the dashboard</li>
            <li>• Tell viewers to type <code className="px-1 py-0.5 rounded bg-[#27272a] text-[#9146FF]">!join</code> in chat</li>
            <li>• Pull viewers and they'll get Discord invites automatically</li>
          </ul>
        </div>

        {/* Go to Dashboard */}
        <a
          href="#dashboard"
          className="w-full py-4 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Gamepad2 className="w-5 h-5" />
          Go to Dashboard
        </a>
      </div>
    </StepCard>
  );
}

// Main Streamer Setup Component
function StreamerSetup() {
  const [currentStep, setCurrentStep] = useState('twitch');

  const goToStep = (step) => setCurrentStep(step);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[40vw] h-[40vw] bg-[#9146FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] bg-[#5865F2]/10 rounded-full blur-[100px]" />
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
            <span className="text-sm text-zinc-500">Streamer Setup</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        <AnimatePresence mode="wait">
          {currentStep === 'twitch' && (
            <TwitchStep key="twitch" onComplete={() => goToStep('discord')} />
          )}
          {currentStep === 'discord' && (
            <DiscordStep
              key="discord"
              onComplete={() => goToStep('bot')}
              onBack={() => goToStep('twitch')}
            />
          )}
          {currentStep === 'bot' && (
            <BotStep
              key="bot"
              onComplete={() => goToStep('ready')}
              onBack={() => goToStep('discord')}
            />
          )}
          {currentStep === 'ready' && <ReadyStep key="ready" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default StreamerSetup;
