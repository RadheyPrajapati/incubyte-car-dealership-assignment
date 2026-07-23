import React from 'react';
import { X, ShoppingBag, Calendar, CheckCircle2, DollarSign, Car, ShieldCheck } from 'lucide-react';

export default function MyPurchasesModal({ isOpen, onClose, purchases, loading }) {
  if (!isOpen) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-dark-800 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-dark-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">My Purchased Garage</h3>
              <p className="text-xs text-gray-400">Your verified vehicle purchase history & ownership records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm font-semibold">Retrieving your garage records...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-2xl border border-gray-800/80">
              <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No Vehicle Purchases Found</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                You haven't purchased any vehicles yet. Explore our executive showroom catalog and click "Purchase" to add cars to your garage!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((p) => {
                const vehicle = p.vehicle || {};
                const imageUrl = vehicle.image || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80`;

                return (
                  <div
                    key={p._id}
                    className="glass-card rounded-2xl p-4 border border-gray-800 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row items-center gap-4"
                  >
                    {/* Vehicle Image Preview */}
                    <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-dark-900 shrink-0 relative">
                      <img
                        src={imageUrl}
                        alt={`${vehicle.make || 'Vehicle'} ${vehicle.model || ''}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-amber-400 backdrop-blur-sm border border-amber-500/20 uppercase">
                        {vehicle.category || 'Luxury'}
                      </span>
                    </div>

                    {/* Vehicle & Transaction Info */}
                    <div className="flex-1 w-full space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-bold text-white tracking-tight">
                            {vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Purchased Vehicle'}
                          </h4>
                          <p className="text-xs text-gray-400 font-medium">
                            Model Year: {vehicle.year || '2024'} {vehicle.vin ? `• VIN: ${vehicle.vin}` : ''}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.status || 'Completed'}
                        </span>
                      </div>

                      <div className="pt-2 flex flex-wrap justify-between items-end border-t border-gray-800/60 mt-2 text-xs">
                        <div className="text-gray-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Purchased on: <strong className="text-gray-200">{formatDate(p.purchaseDate || p.createdAt)}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 block uppercase font-semibold">Total Paid</span>
                          <span className="text-base font-extrabold text-amber-400">{formatPrice(p.totalPrice || vehicle.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-dark-900/60 flex justify-between items-center text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official Apex Motors Digital Ownership Records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-dark-900 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            Close Garage
          </button>
        </div>

      </div>
    </div>
  );
}
