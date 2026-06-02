import React, { useState } from 'react';
import { AdoptionProfile } from '../types';
import { Award, PenTool, Sparkles, Download, Heart, RefreshCw, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playHappyBubble, playTickle } from './AudioSynth';

interface CertificateBuilderProps {
  onAccessoryChange: (acc: 'none' | 'scarf' | 'bow' | 'sprout_leaf' | 'flower') => void;
  selectedAccessory: 'none' | 'scarf' | 'bow' | 'sprout_leaf' | 'flower';
}

export default function CertificateBuilder({ onAccessoryChange, selectedAccessory }: CertificateBuilderProps) {
  const [parentName, setParentName] = useState('');
  const [plushieName, setPlushieName] = useState('Sir Sprout');
  const [personality, setPersonality] = useState<'Sleepy' | 'Playful' | 'Chaotic Cozy' | 'Zen Master' | 'Waffle-Lover'>('Playful');
  const [favoriteSnack, setFavoriteSnack] = useState('Sprout Salad');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [birthWeight, setBirthWeight] = useState('480g of cloud-stuffing');

  const randomNames = ['Boba', 'Matcha', 'Fern', 'Pebble', 'Basil', 'Glover', 'Squeezy', 'Kermit', 'Barnaby'];
  const personalities = ['Sleepy', 'Playful', 'Chaotic Cozy', 'Zen Master', 'Waffle-Lover'] as const;
  const snacks = ['Green Tea', 'Sprout Salad', 'Matcha Cookies', 'Dandelion Honey', 'Dewdrops'];

  const handleRandomizeName = () => {
    const random = randomNames[Math.floor(Math.random() * randomNames.length)];
    setPlushieName(random);
    playHappyBubble();
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadSuccess(true);
    playTickle();
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Settings Form: Left Side (5cols) */}
      <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <PenTool className="w-5 h-5" />
            </span>
            <h3 className="font-display text-2xl font-bold text-gray-800">
              Customize Companion
            </h3>
          </div>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Every plushie deserves a caring companion profile. Choose their favorite traits, accessories, and print their official birth certificate.
          </p>

          <form onSubmit={handleDownload} className="space-y-5">
            {/* Parent Name */}
            <div>
              <label htmlFor="adoptive-parent-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                Adoptive Parent Name
              </label>
              <input
                id="adoptive-parent-name"
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Your Name (e.g. Cuddle Enthusiast)"
                className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 text-sm text-gray-800 transition-all font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
                maxLength={26}
                required
              />
            </div>

            {/* Plushie Name with Randomizer */}
            <div>
              <label htmlFor="plushie-birth-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex justify-between items-center">
                <span>Plushie Birth Name</span>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  aria-label="Generate a random plushie name"
                  className="text-emerald-600 hover:text-emerald-700 font-mono text-[10px] font-bold flex items-center gap-1 uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded px-1"
                >
                  <RefreshCw className="w-3 h-3 animate-spin-hover" />
                  Spin Name
                </button>
              </label>
              <div className="relative">
                <input
                  id="plushie-birth-name"
                  type="text"
                  value={plushieName}
                  onChange={(e) => setPlushieName(e.target.value)}
                  placeholder="Give your plushie a name..."
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 text-sm font-bold text-gray-800 transition-all font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
                  maxLength={18}
                  required
                />
              </div>
            </div>

            {/* Accessory Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-2">
                Cozy Neck Accessory
              </label>
              <div role="group" aria-label="Neck Accessory Selection" className="grid grid-cols-5 gap-2">
                {(['none', 'scarf', 'bow', 'sprout_leaf', 'flower'] as const).map((acc) => {
                  const isSelected = selectedAccessory === acc;
                  return (
                    <button
                      key={acc}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`Select ${acc === 'sprout_leaf' ? 'sprout leaf' : acc} accessory`}
                      onClick={() => {
                        onAccessoryChange(acc);
                        playHappyBubble();
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-[10px] font-semibold tracking-tight transition-all uppercase font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50/30 hover:bg-emerald-100/50 border-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span className="text-sm mb-1">
                        {acc === 'none' && '👕'}
                        {acc === 'scarf' && '🧣'}
                        {acc === 'bow' && '🎀'}
                        {acc === 'sprout_leaf' && '🍃'}
                        {acc === 'flower' && '🌸'}
                      </span>
                      <span className="scale-[0.85] truncate max-w-full">
                        {acc === 'sprout_leaf' ? 'sprout' : acc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personality Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="core-personality-alignment" className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                  Core Alignment
                </label>
                <select
                  id="core-personality-alignment"
                  value={personality}
                  onChange={(e) => {
                    setPersonality(e.target.value as any);
                    playHappyBubble();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 text-xs font-medium text-gray-800 transition-all font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
                >
                  {personalities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fav Snack */}
              <div>
                <label htmlFor="favorite-snack-select" className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                  Fav Snack
                </label>
                <select
                  id="favorite-snack-select"
                  value={favoriteSnack}
                  onChange={(e) => {
                    setFavoriteSnack(e.target.value);
                    playHappyBubble();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 text-xs font-medium text-gray-800 transition-all font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
                >
                  {snacks.map((snk) => (
                    <option key={snk} value={snk}>
                      {snk}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secret Birthweight */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1.5 font-sans">
                Stuffing Weight
              </label>
              <div role="group" aria-label="Stuffing Weight" className="flex gap-2">
                {['450g Light-Cloud', '480g Soft-Dream', '550g Extra-Dense'].map((weightLabel) => {
                  const isWeightSelected = birthWeight.startsWith(weightLabel.substring(0,4));
                  return (
                    <button
                      key={weightLabel}
                      type="button"
                      aria-pressed={isWeightSelected}
                      onClick={() => {
                        setBirthWeight(weightLabel);
                        playHappyBubble();
                      }}
                      className={`flex-1 py-1.5 border rounded-lg text-[10px] font-mono transition-all font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                        isWeightSelected
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-white border-gray-100 text-gray-500 hover:bg-emerald-50/40'
                      }`}
                    >
                      {weightLabel.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold py-3 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Award className="w-5 h-5" />
              Adopt & Print Certificate
            </button>
          </form>
        </div>
      </div>

      {/* Live Certificate: Right Side (7cols) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full max-w-[580px] bg-[#fffbf4] border-4 border-double border-amber-300 rounded-[32px] p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col justify-between aspect-[1.414/1]">
          {/* Certificate Watermark Graphic */}
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <div className="w-[320px] h-[320px] rounded-full border-[20px] border-amber-800" />
          </div>

          {/* Certificate Header Stamp */}
          <div className="flex justify-between items-start text-amber-900 border-b border-dashed border-amber-200 pb-4 relative z-10">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-700">
                Official Document
              </p>
              <h4 className="font-display text-lg font-black tracking-normal uppercase leading-none md:text-xl text-amber-900 mt-1">
                Certificate of Adoption
              </h4>
            </div>
            
            <div className="text-right">
              <span className="font-mono text-[9px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                NO. SP-2026-9938
              </span>
              <p className="text-[10px] text-amber-800/80 font-mono mt-1">Sprout Nursery, C1</p>
            </div>
          </div>

          {/* Certificate Core Statement */}
          <div className="my-6 md:my-8 text-center space-y-4 md:space-y-6 relative z-10">
            <h5 className="font-mono text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              THIS CERTIFIES WITH EXTRA CUDDLY ASSURANCE THAT
            </h5>

            <div className="space-y-1">
              <span className="font-display text-3xl md:text-4xl font-black text-emerald-800 border-b-2 border-dashed border-emerald-300 min-w-[200px] inline-block px-4 py-1">
                {plushieName || 'Unnamed Friend'}
              </span>
              <p className="text-xs text-amber-800/70 italic mt-1 font-serif">
                has been legally adopted into the cozy household of
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-sm md:text-base font-bold text-gray-800 min-w-[160px] inline-block px-4">
                {parentName || '________________________'}
              </span>
              <div className="w-full flex items-center justify-center">
                <div className="w-16 h-[1px] bg-amber-200" />
                <span className="px-2 text-[10px] font-mono text-amber-800 font-semibold uppercase">
                  LEGAL FOSTER GUARDIAN
                </span>
                <div className="w-16 h-[1px] bg-amber-200" />
              </div>
            </div>
          </div>

          {/* Core metadata columns */}
          <div className="grid grid-cols-3 gap-2 border-t border-dashed border-amber-200 pt-4 text-xs font-mono text-amber-900 relative z-10 text-center md:text-left">
            <div className="border-r border-amber-100 pr-2">
              <span className="text-[9px] uppercase font-semibold text-amber-700 block">
                Personality
              </span>
              <span className="font-bold text-emerald-800">{personality}</span>
            </div>
            <div className="border-r border-amber-100 px-2 text-center">
              <span className="text-[9px] uppercase font-semibold text-amber-700 block">
                Weight & Stuffing
              </span>
              <span className="font-bold text-emerald-800">{birthWeight.split(' ')[0]}</span>
            </div>
            <div className="pl-2 text-right">
              <span className="text-[9px] uppercase font-semibold text-amber-700 block">
                Favorite Snack
              </span>
              <span className="font-bold text-emerald-800">{favoriteSnack}</span>
            </div>
          </div>

          {/* Gold certified seal stamp */}
          <div className="absolute bottom-12 right-6 md:right-10 pointer-events-none z-20">
            <div className="relative flex items-center justify-center">
              {/* Dynamic badge backplate */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-400 rounded-full border-4 border-dashed border-amber-300 flex items-center justify-center rotate-12 shadow-sm animate-pulse">
                <div className="text-center font-display text-[9px] md:text-[10px] font-black leading-tight text-amber-950 uppercase rotate-[-12deg]">
                  Squeezed<br/>With<br/>Love ❤️
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action success animation bubble */}
        <AnimatePresence>
          {downloadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl max-w-[420px] text-center shadow-xs"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-display font-bold text-sm mb-1.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100 animate-bounce" />
                Adoption Confirmed! 🎉
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Our sprout gnomes are gathering fluff and preparing your physical Adoption Certificate! Sprout is squeaking excitedly in anticipation of joining you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
