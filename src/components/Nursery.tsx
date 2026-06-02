import React, { useState } from 'react';
import { PlushieItem } from '../types';
import { Sparkles, Heart, ShieldCheck, ShoppingCart, Info, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NurseryProps {
  onPreview: (item: PlushieItem) => void;
  onAddToCart: (item: PlushieItem) => void;
  selectedPlushieId?: string;
}

export const PLUSHIE_PRODUCTS: PlushieItem[] = [
  {
    id: 'sprout-dino',
    name: 'Sprout the Cozy Dino',
    codename: 'sprout-dino',
    price: 34.99,
    originalPrice: 42.00,
    rating: 4.9,
    reviewsCount: 148,
    description: 'Our flagship cuddle champion, with soft felt-spikes and a huggable tummy. Made of recycled premium eco-cotton fibers and stuffed with custom memory fluff.',
    category: 'Sprouts',
    primaryColor: '#7cb342', // gorgeous sage leaf green
    bellyColor: '#fff9c4', // pastel yellow tummy
    cheekColor: '#ff8a80', // blushing peach cheeks
    isLimited: false,
    accentType: 'dino',
    imageUrl: 'Dinosaur'
  },
  {
    id: 'matcha-bear',
    name: 'Matcha Cushion Bear',
    codename: 'matcha-bear',
    price: 38.00,
    rating: 5.0,
    reviewsCount: 92,
    description: 'A cozy rotund matcha-latte colored bear with warm blushing cheeks. He loves watching rain storms and sipping baby chamomile tea with biscuits.',
    category: 'Forest',
    primaryColor: '#558b2f', // matcha forest green
    bellyColor: '#f1f8e9', // matcha foam cream
    cheekColor: '#ffb74d', // warm ginger-blush cheeks
    isLimited: true,
    accentType: 'bear',
    imageUrl: 'Bear'
  },
  {
    id: 'pippin-frog',
    name: 'Pippin Lilypad Frog',
    codename: 'pippin-frog',
    price: 29.50,
    originalPrice: 35.00,
    rating: 4.8,
    reviewsCount: 204,
    description: 'With large round bulging eyes and incredibly soft squishy cheeks, Pippin is the perfect companion for bedside tables or study desks.',
    category: 'Forest',
    primaryColor: '#2e7d32', // rich grass lilypad green
    bellyColor: '#e8f5e9', // mint foam cream
    cheekColor: '#f06292', // pink blush
    isLimited: false,
    accentType: 'frog',
    imageUrl: 'Frog'
  },
  {
    id: 'sproutling-seed',
    name: 'Baby Sproutling Seedling',
    codename: 'sproutling-seed',
    price: 26.00,
    rating: 4.9,
    reviewsCount: 76,
    description: 'A tiny, energetic newborn sproutling plushie with two tiny flexible leaves popping from its soft round head. Fits snugly in one hand!',
    category: 'Tiny',
    primaryColor: '#9ccc65', // bright lime green sprout
    bellyColor: '#fffde7', // warm sunny milk
    cheekColor: '#ff8a80', // cherry blush
    isLimited: false,
    accentType: 'sprout',
    imageUrl: 'Sprout'
  },
  {
    id: 'mossy-turtle',
    name: 'Mossy Forest Turtle',
    codename: 'mossy-turtle',
    price: 45.00,
    rating: 4.9,
    reviewsCount: 54,
    description: 'A limited elder turtle with a cozy forest moss shell and highly structured soft scale stitch details. Highly collectible and ultra-soft comfort master.',
    category: 'Limited',
    primaryColor: '#33691e', // dark moss green
    bellyColor: '#fff59d', // banana leaf cream
    cheekColor: '#ffab91', // coral blush
    isLimited: true,
    accentType: 'dino', // dino acts as turtle spikes / tail
    imageUrl: 'Turtle'
  }
];

export default function Nursery({ onPreview, onAddToCart, selectedPlushieId }: NurseryProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Sprouts' | 'Forest' | 'Tiny' | 'Limited'>('All');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter products based on activeTab
  const filteredProducts = PLUSHIE_PRODUCTS.filter(item => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div role="tablist" aria-label="Plushie categories" className="flex flex-wrap justify-center gap-2 mb-10">
        {(['All', 'Sprouts', 'Forest', 'Tiny', 'Limited'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-display text-sm font-semibold transition-all duration-300 shadow-xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
              activeTab === tab
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200 scale-105'
                : 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-100 text-emerald-800'
            }`}
          >
            {tab} {tab === 'Limited' && '✨'}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((item) => {
            const isSelected = selectedPlushieId === item.id;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                key={item.id}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`relative bg-white border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl scale-[1.01]' 
                    : 'border-emerald-100 hover:border-emerald-200 hover:shadow-lg shadow-sm'
                }`}
              >
                {/* Ribbon for Limited Edition */}
                {item.isLimited && (
                  <div className="absolute top-4 left-4 z-10 bg-amber-400 text-amber-950 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Limited Drop
                  </div>
                )}

                {/* Styled Toy-Tag Aesthetic Header */}
                <div className="p-6 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.accentType.toUpperCase()} CLASS
                      </span>
                      <h3 className="font-display text-xl font-bold text-gray-800 mt-1.5 leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      {item.originalPrice && (
                        <span className="text-xs line-through text-gray-400 block -mb-1">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="font-display text-2xl font-bold text-emerald-700">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plushie Feature Container Graphic representation */}
                <div className="px-6 py-2 flex-grow">
                  <div className="bg-gradient-to-br from-emerald-50/40 to-emerald-100/30 rounded-2xl p-4 relative overflow-hidden h-44 flex items-center justify-center">
                    
                    {/* Stylized geometric background shape representing a plushie bubble */}
                    <div 
                      className="w-28 h-28 rounded-full opacity-60 filter blur-lg animate-pulse" 
                      style={{ backgroundColor: item.primaryColor }}
                    />

                    {/* Highly aesthetic vector rendering of plushie components in card */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      {/* Big stylized eye circles, blushing cheeks, and accent icon */}
                      <div className="flex gap-1.5 items-center justify-center mb-1 bg-white/60 p-2.5 rounded-full shadow-xs backdrop-blur-xs border border-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                        <span className="text-xs font-display font-medium text-emerald-900 px-1">
                          {item.accentType === 'dino' && '🦕 Cozy Dino'}
                          {item.accentType === 'bear' && '🐻 Sleepy Bear'}
                          {item.accentType === 'frog' && '🐸 Lily Frog'}
                          {item.accentType === 'sprout' && '🌱 Baby Sprout'}
                        </span>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      </div>
                      <div className="flex gap-6 mt-1 opacity-80">
                        <div className="w-3.5 h-1.5 rounded-full" style={{ backgroundColor: item.cheekColor }} />
                        <div className="w-3.5 h-1.5 rounded-full" style={{ backgroundColor: item.cheekColor }} />
                      </div>
                    </div>

                    {/* Stats overlay tag */}
                    <div className="absolute bottom-3 left-3 flex gap-1 items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-2xs border border-emerald-50">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span className="text-[10px] font-mono font-bold text-emerald-800">
                        Cozy-Index: 10/10
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex gap-1 items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-2xs border border-emerald-50">
                      <ShieldCheck className="w-3 h-3 text-teal-600" />
                      <span className="text-[10px] font-mono font-medium text-teal-800">
                        100% Bio-Fluff
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Buttons container */}
                <div className="p-6 pt-2 flex gap-3">
                  <button
                    onClick={() => onPreview(item)}
                    aria-label={`Preview ${item.name} in interactive 3D model spotlight above`}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-50 border border-gray-100 hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-100'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {isSelected ? 'Selected (Active 3D)' : 'Preview in 3D'}
                  </button>

                  <button
                    onClick={() => onAddToCart(item)}
                    aria-label={`Adopt ${item.name} for $${item.price.toFixed(2)} and add to adoption bag`}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-sm relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    title="Adopt (Add to Cart)"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-xs font-display px-1 hidden sm:inline">Adopt</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
