import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  ArrowRight, 
  ShoppingBag as CartIcon, 
  X, 
  Trash2, 
  Info, 
  Bookmark, 
  Globe2, 
  Gift, 
  Smile, 
  HelpCircle, 
  Leaf, 
  Check, 
  Plus, 
  Minus,
  MessageSquareHeart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ThreePlushie from './components/ThreePlushie';
import Nursery, { PLUSHIE_PRODUCTS } from './components/Nursery';
import CertificateBuilder from './components/CertificateBuilder';
import { playHappyBubble, playSqueak, playTickle, playFeed } from './components/AudioSynth';
import { PlushieItem, Testimonial } from './types';

export default function App() {
  // 3D Model customized settings
  const [primaryColor, setPrimaryColor] = useState('#7cb342'); // Flagship minty-green
  const [bellyColor, setBellyColor] = useState('#fff9c4');
  const [cheekColor, setCheekColor] = useState('#ff8a80');
  const [accentType, setAccentType] = useState<'dino' | 'bear' | 'frog' | 'sprout'>('dino');
  const [selectedAccessory, setSelectedAccessory] = useState<'none' | 'scarf' | 'bow' | 'sprout_leaf' | 'flower'>('none');
  
  // Interactive 3D triggers
  const [triggerSquish, setTriggerSquish] = useState(0);
  const [triggerTickle, setTriggerTickle] = useState(0);
  const [triggerFeed, setTriggerFeed] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState<string | null>("Hello! I am Sprout. Tap me to squeeze!");

  // Synthesizer Mute State (default to true to obey browser click policies, easily unmutable)
  const [isMuted, setIsMuted] = useState(true);

  // Cart State
  const [cart, setCart] = useState<{ item: PlushieItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [selectedPlushieId, setSelectedPlushieId] = useState('sprout-dino');
  
  // Listen for Escape key to close open panels
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsAdoptionModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Newsletter signup completion
  const [emailSignedUp, setEmailSignedUp] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');

  // Green color preset arrays (all plushie-friendly, light pastel sweet tones)
  const GREEN_PRESETS = [
    { name: 'Minty Sage', hex: '#7cb342', tailwind: 'bg-[#7cb342]' },
    { name: 'Matcha Foam', hex: '#558b2f', tailwind: 'bg-[#558b2f]' },
    { name: 'Sprout Lime', hex: '#9ccc65', tailwind: 'bg-[#9ccc65]' },
    { name: 'Classic Clover', hex: '#2e7d32', tailwind: 'bg-[#2e7d32]' },
    { name: 'Mossy Fern', hex: '#33691e', tailwind: 'bg-[#33691e]' },
  ];

  const TESTIMONIALS: Testimonial[] = [
    {
      id: 'r1',
      author: 'Chloe M.',
      avatarUrl: '🌸',
      rating: 5,
      date: 'Adopted 2 weeks ago',
      text: 'Sprout is literally the softest creature in my universe. The double-stitching is so sturdy I take him on all my train trips. 10/10 squeezes!',
      adoptedPlushie: 'Sprout the Cozy Dino',
      heartColor: 'text-rose-400'
    },
    {
      id: 'r2',
      author: 'Lucas K.',
      avatarUrl: '🍃',
      rating: 5,
      date: 'Adopted 1 month ago',
      text: 'The interactive 3D builder on the website matched the actual physical bear perfectly. Stuffed with organic memory foam, it has been my ultimate sleeping pillow.',
      adoptedPlushie: 'Matcha Cushion Bear',
      heartColor: 'text-emerald-400'
    },
    {
      id: 'r3',
      author: 'Selena P.',
      avatarUrl: '🧸',
      rating: 5,
      date: 'Adopted 3 days ago',
      text: 'My daughter is obsessed with frogs, so we adopted Pippin. He arrived with a lovely printed birth certificate with her name! What a sweet, responsive company.',
      adoptedPlushie: 'Pippin Lilypad Frog',
      heartColor: 'text-amber-400'
    }
  ];

  // Helper: Squeeze action
  const handleSqueezeAction = () => {
    setTriggerSquish(prev => prev + 1);
    setActiveSpeech("Squeeeeeeeak! That feels amazing!");
    if (!isMuted) playSqueak();
    setTimeout(() => {
      setActiveSpeech(null);
    }, 4000);
  };

  // Helper: Tickle ears action
  const handleTickleAction = () => {
    setTriggerTickle(prev => prev + 1);
    setActiveSpeech("Hehehe! Stop it, it wiggles!");
    if (!isMuted) playTickle();
    setTimeout(() => {
      setActiveSpeech(null);
    }, 4000);
  };

  // Helper: Feed Sprout action
  const handleFeedAction = () => {
    setTriggerFeed(prev => prev + 1);
    setActiveSpeech("Munch munch munch... Sweet green leaf leaf!");
    if (!isMuted) playFeed();
    setTimeout(() => {
      setActiveSpeech(null);
    }, 4000);
  };

  // Sound Unlock Handler
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute) {
      playHappyBubble();
      setActiveSpeech("Yay! Sound is unlocked! Tap my buttons below.");
      setTimeout(() => setActiveSpeech(null), 5000);
    }
  };

  // Nursery: Preview in 3D Model logic
  const handlePreviewPlushie = (item: PlushieItem) => {
    setPrimaryColor(item.primaryColor);
    setBellyColor(item.bellyColor);
    setCheekColor(item.cheekColor);
    setAccentType(item.accentType);
    setSelectedPlushieId(item.id);
    setActiveSpeech(`Now previewing ${item.name}! Check me out!`);
    
    // Auto scroll to 3D model with smooth behavior
    const element = document.getElementById('three-plushie-canvas-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    if (!isMuted) playHappyBubble();
  };

  // Nursery: Add to Cart logic
  const handleAddToCart = (item: PlushieItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
    
    // Open cart sidebar drawer
    setIsCartOpen(true);
    setActiveSpeech(`Adopted ${item.name}! He's packed with fluff.`);
    
    if (!isMuted) playHappyBubble();
  };

  // Cart Adjustments
  const changeQty = (itemId: string, diff: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.item.id === itemId) {
          const next = i.quantity + diff;
          return { ...i, quantity: next > 0 ? next : 1 };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  // Calculate Subtotal
  const subtotal = cart.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);

  // Email form submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setEmailSignedUp(true);
      if (!isMuted) playHappyBubble();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans text-gray-800 antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Cozy Announcement Bar */}
      <div className="bg-emerald-50 text-emerald-800 text-center py-2 px-4 border-b border-rose-100/30 text-[11px] md:text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <span>📦 Free Worldwide Cuddle Shipping on all Plushie Adoptions this week!</span>
        <span className="hidden md:inline">🍬 Each companion includes a customized physical certificate!</span>
      </div>

      {/* 2. Interactive Navigation Header */}
      <nav id="main-cozy-navigation" className="sticky top-0 z-40 bg-[#faf8f4]/80 backdrop-blur-xl border-b border-emerald-100/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo - Rounded Cute Style */}
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:rotate-12 transition-all duration-300">
              <Leaf className="w-5 h-5 fill-emerald-100" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-emerald-950 block">
                Sprout & Friends
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#558b2f] block leading-none font-bold">
                Premium Plushies
              </span>
            </div>
          </div>

          {/* Nav Links - Desktop Only */}
          <div className="hidden md:flex items-center gap-7 bg-emerald-50/50 border border-emerald-100/50 px-6 py-2 rounded-full text-xs font-mono tracking-tight font-bold text-emerald-900/80">
            <a href="#hero-sandbox" className="hover:text-emerald-700 transition-colors">3D Spotlight</a>
            <a href="#nursery" className="hover:text-emerald-700 transition-colors">The Nursery</a>
            <a href="#cert-builder" className="hover:text-emerald-700 transition-colors">Certificate Lab</a>
            <a href="#testimonials" className="hover:text-emerald-700 transition-colors">Fluffy Parents</a>
          </div>

          {/* Quick Buttons Stack */}
          <div className="flex items-center gap-3">
            
            {/* Real-time Web Synthesizer Audio Controller Button */}
            <button
              onClick={toggleMute}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isMuted 
                  ? 'bg-rose-50/50 border-rose-100 text-rose-700 hover:bg-rose-100/50' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
              title={isMuted ? 'Turn Sound On for Cute Squeaks!' : 'Mute Sounds'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase hidden lg:inline">Unlock Sound</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="text-[10px] font-mono font-bold uppercase hidden lg:inline">Active Noise 🔊</span>
                </>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all font-bold flex items-center gap-2 shadow-sm relative group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-display hidden sm:inline">Nursery Bag</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* 3. Hero Interactive Spot Section */}
      <section id="hero-sandbox" className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Background Blob Aesthetics */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-emerald-200/20 rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-yellow-100/20 rounded-full filter blur-3xl pointer-events-none -z-10" />

        {/* Content Side (5cols) */}
        <div className="lg:col-span-5 space-y-8 relative z-10 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-emerald-100/60 font-mono text-emerald-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Interactive 3D Customize Lab</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
              Meet <span className="text-emerald-700 underline decoration-double decoration-emerald-200">Sprout</span>, Your Cute Furry Soulmate
            </h1>
            <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Every Sprout series plushie is procedurally modeled to perfection in our custom 3D playground. Squeeze, feed, or tickle them to hear and see real-time fluffy reactions! Fully organic cotton felt, stuffed with soft memory fluff.
            </p>
          </div>

          {/* Quick Sound Instructions if Muted */}
          {isMuted && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-left">
              <span className="text-xl">💡</span>
              <p className="text-xs text-amber-900 leading-normal">
                <strong>Try enabling cozy sounds:</strong> Clicking the "Unlock Sound" button in the corner empowers Sprout to pop, squeak, and giggle on-screen!
              </p>
            </div>
          )}

          {/* Active Customizer Control Panel */}
          <div className="bg-white border border-emerald-100/60 p-5 md:p-6 rounded-3xl shadow-xs space-y-6">
            
            {/* Color preset grid */}
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-2 text-left">
                1. Select Leafy Shade
              </span>
              <div className="flex gap-3 justify-start items-center">
                {GREEN_PRESETS.map((color) => {
                  const isActive = primaryColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => {
                        setPrimaryColor(color.hex);
                        if (!isMuted) playHappyBubble();
                      }}
                      className={`w-10 h-10 rounded-full ${color.tailwind} relative transition-all duration-200 ${
                        isActive ? 'ring-4 ring-emerald-500/20 scale-110 shadow-sm' : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {isActive && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template select tabs */}
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-2 text-left">
                2. Companion Shape Template
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'dino', label: '🦕 Dino', color: 'bg-emerald-500' },
                  { id: 'bear', label: '🐻 Bear', color: 'bg-amber-500' },
                  { id: 'frog', label: '🐸 Frog', color: 'bg-green-500' },
                  { id: 'sprout', label: '🌱 Sprout', color: 'bg-lime-500' }
                ].map((item) => {
                  const isActive = accentType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAccentType(item.id as any);
                        if (!isMuted) playHappyBubble();
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold font-display tracking-tight transition-all uppercase ${
                        isActive 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-gray-50 text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Squishy React Actions Grid */}
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-2 text-left">
                3. Physical Interaction Controls
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSqueezeAction}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border border-emerald-100 active:scale-95"
                >
                  <span className="text-sm">👐</span>
                  Squeeze Me
                </button>
                <button
                  onClick={handleTickleAction}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border border-emerald-100 active:scale-95"
                >
                  <span className="text-sm">🪶</span>
                  Tickle Ears
                </button>
                <button
                  onClick={handleFeedAction}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border border-emerald-100 active:scale-95"
                >
                  <span className="text-sm">🍃</span>
                  Feed Snack
                </button>
              </div>
            </div>

          </div>

          {/* Quick CTA list */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#nursery"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold px-8 py-4 rounded-2xl shadow-md shadow-emerald-200/50 transition-all flex items-center justify-center gap-2 text-base"
            >
              Browse Fluffy Friends
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#cert-builder"
              className="bg-white hover:bg-emerald-50 border border-emerald-100 text-emerald-800 font-display font-bold px-8 py-4 rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-1.5 text-base"
            >
              <Gift className="w-5 h-5" />
              Build Adoption Certificate
            </a>
          </div>

        </div>

        {/* 3D Interactive Canvas Box Side (7cols) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-radial from-emerald-500/[0.04] to-transparent p-4 md:p-8 rounded-[48px] border border-emerald-100/40 relative flex flex-col items-center justify-center min-h-[480px]">
          
          {/* Main 3D Canvas Box Container */}
          <div className="w-full h-full relative z-10">
            <ThreePlushie
              primaryColor={primaryColor}
              bellyColor={bellyColor}
              cheekColor={cheekColor}
              accentType={accentType}
              accessory={selectedAccessory}
              triggerSquish={triggerSquish}
              triggerTickle={triggerTickle}
              triggerFeed={triggerFeed}
              isMuted={isMuted}
            />
          </div>

          {/* Dynamic Interactive Speech thoughts bubble overlay */}
          <AnimatePresence>
            {activeSpeech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-6 left-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-emerald-100 max-w-[340px] z-20 pointer-events-none"
              >
                <div className="flex gap-2 items-start text-xs text-gray-700">
                  <span className="text-base">💬</span>
                  <div>
                    <span className="font-semibold block font-display text-emerald-950">Sprout says:</span>
                    <p className="mt-0.5 leading-relaxed font-sans font-medium">{activeSpeech}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Bottom controls banner info */}
          <div className="absolute bottom-4 text-center z-10">
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">
              💻 Rotate with mouse or finger drag
            </span>
          </div>

        </div>

      </section>

      {/* 4. Squeezable Quality Section (Handcrafted Eco parameters) */}
      <section className="bg-white border-y border-emerald-100/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="font-mono text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Why Sprout is Superior
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900">
              The Finest Fluff in any Universe
            </h2>
            <p className="text-gray-500 text-sm">
              We never cut corners on cuddles. Every plushie is designed, stuffed, and lock-stitched for generation-level resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs">
                🏷️
              </div>
              <h3 className="font-display text-lg font-bold text-gray-800">
                Adoption Registry
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No store-shelf feeling. Each companion arrives with a physical registered certificate detailing their favorite snacks, alignment, and foster history papers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs">
                🍃
              </div>
              <h3 className="font-display text-lg font-bold text-gray-800">
                100% Recycled Cotton
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sewn with certified organic bio-fiber threads and stuffed with ultra-soft Recycled PET flakes. Good for the planet, cozy for your sweet cheek rest.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs">
                🪡
              </div>
              <h3 className="font-display text-lg font-bold text-gray-800">
                Lock-Stitch Assurance
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fitted with child-safety double lock-stitches. No fuzzy material leaks or stray fluff, even under extreme hug loads and playful sibling tug-of-wars.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. The Plushie Nursery Section */}
      <section id="nursery" className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-center md:text-left">
          <div className="space-y-3">
            <span className="font-mono text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Adoptive Catalog
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-gray-900">
              The Sprout & Friends Nursery
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl">
              Tap any companion to inspect their premium profile or immediately **load them onto the interactive 3D camera** spotlight above!
            </p>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
              ✨ Click to view on 3D Model!
            </span>
          </div>
        </div>

        <Nursery 
          onPreview={handlePreviewPlushie} 
          onAddToCart={handleAddToCart}
          selectedPlushieId={selectedPlushieId}
        />
      </section>

      {/* 6. Certificate Builder Section */}
      <section id="cert-builder" className="py-20 bg-gradient-to-br from-amber-50/30 to-emerald-50/30 border-t border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Legal Foster Lab
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-gray-900">
              Print Official Adoption Papers
            </h2>
            <p className="text-gray-500 text-sm">
              Birth weight, snack alignments, or customized accessory additions. Fill the official forms below to lock Sprout's fosters registry in our system.
            </p>
          </div>

          <CertificateBuilder 
            onAccessoryChange={(acc) => setSelectedAccessory(acc)} 
            selectedAccessory={selectedAccessory} 
          />
        </div>
      </section>

      {/* 7. Testimonials/Reviews */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="font-mono text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Fluffy Testimonials
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900">
              Approved by Professional Cuddlers
            </h2>
            <p className="text-gray-500 text-sm">
              Over 2,400+ homes colonized with warm, mint-green plushy companions. Here is what parents say:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((rev) => (
              <div 
                key={rev.id}
                className="bg-[#faf8f4] border border-emerald-100/40 p-6 md:p-8 rounded-2xl space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-emerald-100/20">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl bg-white p-1 rounded-full shadow-xs">{rev.avatarUrl}</span>
                    <div>
                      <span className="font-bold text-xs text-gray-800 block">{rev.author}</span>
                      <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-50">
                    🦕 {rev.adoptedPlushie.split(' ').slice(-1)} parent
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter & Join Club */}
      <section className="bg-gradient-to-tr from-[#9ccc65]/10 to-[#7cb342]/10 py-16 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex h-12 w-12 bg-white text-emerald-700 items-center justify-center rounded-2xl shadow-sm text-2xl">
            💌
          </div>
          <h2 className="font-display text-3xl font-black text-gray-950">
            Join the Sprout Fluffy Club
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Subscribe for limited custom plushy seed drops, foster codes, and sweet organic knitting secrets. No slop, ever.
          </p>

          {!emailSignedUp ? (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="fluffy.parent@email.com"
                className="flex-1 px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-800 border-none shadow-xs"
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display text-xs font-bold px-6 py-3 sm:py-0 rounded-xl transition-all"
              >
                Adopt VIP Drops
              </button>
            </form>
          ) : (
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl max-w-sm mx-auto text-emerald-800 font-display font-bold text-sm border border-emerald-100">
              Welcome to the family! 🎉 Watch your email for code <strong>SPROUTLOVE</strong>.
            </div>
          )}
        </div>
      </section>

      {/* 9. Sweet Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 fill-emerald-100" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white block">
                Sprout Plushies
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Making the world a cozier, fluffier, and greener place, one squeak at a time. Crafted responsibly in small batches.
            </p>
          </div>

          {/* Site Map Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Adoption Spots</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero-sandbox" className="hover:text-white transition-colors">Interactive 3D Customize Lab</a></li>
              <li><a href="#nursery" className="hover:text-white transition-colors">The Plushie Nursery</a></li>
              <li><a href="#cert-builder" className="hover:text-white transition-colors">Adoption Papers</a></li>
            </ul>
          </div>

          {/* Policies info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">The Fluffy Promises</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="block text-slate-400">🔒 Double-Lock Stitch Refund Guarantee</span></li>
              <li><span className="block text-slate-400">🍃 100% Recycled PET Bio-Stuffing certified</span></li>
              <li><span className="block text-slate-400">🌱 Organic foster care for newborn seed sprouts</span></li>
            </ul>
          </div>

          {/* Social references */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">The Sprout Nursery</h4>
            <div className="text-xs text-slate-400 space-y-1.5 font-mono">
              <p>📍 Sprout Greenhouse Nursery, C1</p>
              <p>💌 adopt@sprout-plushies.com</p>
              <p className="text-[10px] text-slate-500">Active server port bound correctly.</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
          <p>© 2026 Sprout & Friends Plushies Inc. Designed with extreme cuddle alignment.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Care</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Squeeze Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* 10. Sliding Right-side Shopping Cart Drawer Interface */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Inner Drawer Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-[#faf8f4] shadow-2xl flex flex-col justify-between border-l border-emerald-100"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-rose-100/10 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2 text-emerald-950 font-display text-lg font-bold">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <h4>Your Adoption Basket</h4>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <span className="text-4xl block">🧺</span>
                      <h5 className="font-display font-bold text-gray-800 text-lg">Your basket is empty!</h5>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        There are no snuggly plushies in your carriage yet. Head to the nursery to find your cozy green companion!
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-display text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all"
                      >
                        Browse Friends
                      </button>
                    </div>
                  ) : (
                    cart.map((cartItem) => (
                      <div
                        key={cartItem.item.id}
                        className="flex gap-4 p-4 rounded-2xl bg-white border border-emerald-100/50 shadow-2xs items-start"
                      >
                        {/* Graphical representation based on type */}
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center p-1.5 relative overflow-hidden shrink-0" style={{ backgroundColor: `${cartItem.item.primaryColor}1a` }}>
                          <span className="text-2xl">
                            {cartItem.item.accentType === 'dino' && '🦕'}
                            {cartItem.item.accentType === 'bear' && '🐻'}
                            {cartItem.item.accentType === 'frog' && '🐸'}
                            {cartItem.item.accentType === 'sprout' && '🌱'}
                          </span>
                        </div>

                        {/* Middle textual block */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-display font-bold text-sm text-gray-800 truncate">
                            {cartItem.item.name}
                          </h5>
                          <p className="text-[10px] font-mono text-emerald-700 block mt-0.5">
                            {cartItem.item.category.toUpperCase()} DROP
                          </p>
                          <span className="text-xs font-bold text-gray-900 block mt-1.5">
                            ${cartItem.item.price.toFixed(2)}
                          </span>

                          {/* Action parameters count changer */}
                          <div className="flex items-center gap-2 mt-3 bg-[#faf8f4] border border-gray-100 w-fit rounded-lg px-1.5 py-0.5">
                            <button
                              onClick={() => changeQty(cartItem.item.id, -1)}
                              className="p-1 hover:text-emerald-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold px-1.5 min-w-[16px] text-center text-gray-800">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => changeQty(cartItem.item.id, 1)}
                              className="p-1 hover:text-emerald-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Right bin bucket button */}
                        <button
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="p-1 hover:text-red-500 text-gray-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Drawer Footer Calculations */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-emerald-100 bg-white space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>Subtotal adoption papers:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>Fluffy Cuddle Shipping:</span>
                        <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                          FREE
                        </span>
                      </div>
                      <div className="h-[1px] bg-gray-100 my-2" />
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-display font-medium text-gray-800">Adoption Total:</span>
                        <span className="text-xl md:text-2xl font-display font-black text-emerald-800">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Adoption button */}
                    <button
                      onClick={() => {
                        setIsAdoptionModalOpen(true);
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3.5 rounded-xl transition-all font-display font-bold flex items-center justify-center gap-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                      <Check className="w-4 h-4" />
                      Finalize Adoption Registry
                    </button>
                    <p className="text-[10px] text-center text-gray-400 font-mono">
                      🔒 Secured via Sprout double-lock safety standards.
                    </p>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. Cozy Custom Adoption Success Popup Modal */}
      <AnimatePresence>
        {isAdoptionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdoptionModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-inner"
              role="presentation"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="adoption-modal-title"
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 border border-emerald-100 shadow-2xl z-10 text-center space-y-6"
            >
              {/* Confetti Emoji / Ribbon Icon */}
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-3xl shadow-sm border border-emerald-100 animate-bounce">
                🎉
              </div>
              
              <div className="space-y-2">
                <h3 id="adoption-modal-title" className="font-display text-2xl font-black text-gray-950">
                  Adoption Registry Initiated!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-sans">
                  Thank you with extra cuddly assurance for choosing to adopt Sprout's cozy group of friends! We have safely registered your foster papers in our database.
                </p>
              </div>

              {/* Adoption detail checklist box */}
              <div className="bg-[#faf8f4] border border-emerald-100/50 rounded-2xl p-4 text-left space-y-2 font-mono text-xs text-emerald-800">
                <div className="flex gap-2 items-center">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>Fluffy companions assigned: Ready to Ship 📦</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>Adoption papers: Signed by Chief Gnomes ✍️</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>Double-locks: Stitch-tested for maximum hugs ✅</span>
                </div>
              </div>

              {/* Close CTAs */}
              <button
                onClick={() => setIsAdoptionModalOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3.5 rounded-xl transition-all font-display font-bold text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Let's Play with the Customizer!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
