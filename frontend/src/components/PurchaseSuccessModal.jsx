import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, ShoppingBag, ArrowRight, X } from 'lucide-react';

export default function PurchaseSuccessModal({ isOpen, onClose, purchaseData, onViewGarage }) {
  if (!isOpen || !purchaseData) return null;

  const vehicle = purchaseData.vehicle || {};
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(purchaseData.totalPrice || vehicle.price || 0);

  const imageUrl = vehicle.image || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-dark-800 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Glow & Decorative Banner */}
        <div className="relative h-44 w-full bg-dark-900 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white p-1.5 rounded-full bg-black/50 backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Badge */}
          <div className="absolute bottom-3 left-6 flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-dark-900 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Transaction Complete
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Congratulations!</h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          <div className="bg-dark-900/70 border border-gray-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-xs text-gray-400">
                  {vehicle.year} Model • Category: {vehicle.category || 'Executive'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-gray-400 block">Purchase Price</span>
                <span className="text-lg font-extrabold text-amber-400">{formattedPrice}</span>
              </div>
            </div>

            {vehicle.vin && (
              <div className="pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-400 flex justify-between">
                <span>VIN Number:</span>
                <span className="text-gray-200 uppercase">{vehicle.vin}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Digital ownership certificate generated. Added to your garage!</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                if (onViewGarage) onViewGarage();
              }}
              className="flex-1 py-3 px-4 font-bold text-xs text-dark-900 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View My Purchased Garage</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 font-semibold text-xs text-gray-300 hover:text-white bg-dark-900 hover:bg-dark-700 border border-gray-700 rounded-xl flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>Continue Browsing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
