import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  ArrowRight, 
  Twitch, 
  MessageSquare, 
  LayoutDashboard, 
  Users, 
  Zap, 
  ShieldCheck, 
  Play, 
  Menu, 
  X 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-2xl bg-[#18181b]/50 border border-[#27272a] hover:border-[#3f3f46] transition-all group hover:bg-[#18181b]">
      <div className="w-12 h-12 rounded-lg bg-[#27272a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-[#a1a1aa] leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-6 group">
      <div className="font-display font-bold text-3xl text-[#27272a] group-hover:text-[#9146FF] transition-colors">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-[#e4e4e7]">{title}</h3>
        <p className="text-[#a1a1aa]">{description}</p>
      </div>
    </div>
  );
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#09090b] text-white font-sans selection:bg-[#9146FF]/30">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[40vw] h-[40vw] bg-[#9146FF]/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] bg-[#5865F2]/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-[#09090b]/80 backdrop-blur-md border-[#27272a]" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative w-8 h-8 bg-gradient-to-br from-[#9146FF] to-[#5865F2] rounded-lg flex items-center justify-center overflow-hidden">
              <Gamepad2 className="w-5 h-5 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ViewerQ</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a1a1aa]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors hidden sm:block">
              Log in
            </button>
            <button className="group relative px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm overflow-hidden transition-transform active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9146FF] to-[#5865F2] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 md:pt-48 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27272a]/50 border border-[#3f3f46]/50 backdrop-blur-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#9146FF]"></span>
            <span className="text-xs font-medium text-[#d4d4d8] tracking-wide uppercase">Now in Beta 2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
          >
            Tame the chaos of <br /><span className="text-white">viewer games.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ViewerQ automates the queue, the lottery, and the Discord invites so you can focus on the content, not the logistics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#streamer-setup"
              className="w-full sm:w-auto px-8 py-4 bg-[#9146FF] hover:bg-[#8234F8] text-white rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_-5px_rgba(145,70,255,0.5)] flex items-center justify-center gap-2"
            >
              <Twitch className="w-5 h-5" />
              I'm a Streamer
            </a>
            <a
              href="#viewer-setup"
              className="w-full sm:w-auto px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_-5px_rgba(88,101,242,0.5)] flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              I'm a Viewer
            </a>
            <a
              href="#dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              View Demo
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 md:mt-20 pt-4 flex flex-col items-center relative z-10"
          >
            <p className="text-xs md:text-sm text-[#71717a] mb-4 font-medium tracking-[0.2em] uppercase">
              Trusted by streamers on
            </p>
            <div className="flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-8 flex items-center gap-2">
                <Twitch className="w-6 h-6" />
                <span className="font-display font-bold text-xl">Twitch</span>
              </div>
              <div className="h-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span className="font-display font-bold text-xl">Discord</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative z-10 px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-xl border border-[#27272a] bg-[#09090b] shadow-2xl overflow-hidden">
            {/* Top Gloss Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#9146FF] to-transparent opacity-50"></div>
            
            {/* Browser Header */}
            <div className="h-10 border-b border-[#27272a] bg-[#18181b] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#27272a]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27272a]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27272a]"></div>
              </div>
              <div className="ml-4 px-3 py-1 bg-[#09090b] rounded text-xs text-[#52525b] flex-1 max-w-xs border border-[#27272a]">
                viewerq.gg/dashboard
              </div>
            </div>

            {/* Mockup Body */}
            <div className="grid grid-cols-12 min-h-[600px]">
              {/* Sidebar */}
              <div className="hidden md:block col-span-2 border-r border-[#27272a] bg-[#18181b]/30 p-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#e4e4e7]">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#71717a]">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#71717a]">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Discord</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-12 md:col-span-10 pt-16 px-8 pb-8 bg-[#09090b]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">Queue Manager</h3>
                    <p className="text-[#71717a] text-sm">Manage your current session and next players</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Queue Active</span>
                    <button className="w-8 h-8 rounded flex items-center justify-center border border-[#27272a] text-[#a1a1aa]">
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 md:col-span-2 space-y-4">
                    <div className="p-6 rounded-xl border border-[#27272a] bg-[#18181b]/50">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-medium text-white">Next Players</h4>
                        <button className="text-xs bg-[#9146FF] text-white px-3 py-1.5 rounded font-medium">Pull Viewers</button>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#27272a]/30 border border-[#27272a]/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#27272a] flex items-center justify-center text-xs text-[#71717a]">{i}</div>
                              <div>
                                <div className="text-sm font-medium text-white">User_{i}</div>
                                <div className="text-xs text-[#71717a]">Sub • 2m ago</div>
                              </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-1">
                    <div className="p-6 rounded-xl border border-[#27272a] bg-[#18181b]/50 h-full">
                      <h4 className="font-medium text-white mb-4">Voice Status</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          Connected to Voice
                        </div>
                        <div className="pt-4 border-t border-[#27272a]">
                          <div className="text-xs text-[#71717a] uppercase font-medium mb-2">Channel</div>
                          <div className="flex items-center gap-2 text-white">
                            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                            <span>Stream Room 1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#9146FF]/20 to-[#5865F2]/20 rounded-[2rem] blur-2xl -z-10 opacity-50"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Built for the modern streamer</h2>
            <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg">Everything you need to manage viewer games without alt-tabbing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-[#9146FF]" />}
              title="Smart Queue Management"
              description="Fairly select viewers with lottery or first-come-first-served modes. Prioritize Subs and VIPs automatically."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 text-[#5865F2]" />}
              title="Discord Integration"
              description="Automatically creates temporary voice channels and invites selected viewers. No more manual link pasting."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
              title="Safe & Secure"
              description="You control who joins. Kick disruptive players with one click and they're removed from voice instantly."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0c0c0e] border-y border-[#27272a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">How it works</h2>
              <div className="space-y-12">
                <Step 
                  number="01" 
                  title="Viewers Join Queue" 
                  description="Viewers type !join in your Twitch chat to enter the queue. They link their Discord once."
                />
                <Step 
                  number="02" 
                  title="You Pull Players" 
                  description="Select 'Pull 4 Players' on your dashboard. ViewerQ randomly selects winners."
                />
                <Step 
                  number="03" 
                  title="Voice Channel Created" 
                  description="A private voice channel opens in your Discord. Winners get an instant invite."
                />
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/20 to-[#5865F2]/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-2xl h-full flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-[#27272a] rounded-full flex items-center justify-center mb-6 relative">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-[#9146FF] rounded-full flex items-center justify-center border-4 border-[#18181b]">
                      <Twitch className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Play</h3>
                  <p className="text-[#a1a1aa]">4 viewers waiting in voice channel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#27272a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#9146FF] to-[#5865F2] rounded flex items-center justify-center">
              <Gamepad2 className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ViewerQ</span>
          </div>
          <div className="text-sm text-[#52525b]">
            &copy; 2025 ViewerQ. Not affiliated with Twitch or Discord.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
