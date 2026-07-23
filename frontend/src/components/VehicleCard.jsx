import React from 'react';
import { ShoppingCart, Edit3, RefreshCw, Trash2, Tag, Calendar, ShieldCheck } from 'lucide-react';

export default function VehicleCard({
  vehicle,
  currentUser,
  onPurchase,
  onEdit,
  onRestock,
  onDelete
}) {
  const isOutOfStock = vehicle.quantity === 0 || vehicle.status === 'Out of Stock';
  const isAdmin = currentUser?.role === 'ADMIN';

  // Format currency formatted $XX,XXX
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price || 0);

  // Dynamic fallback SVG/Image cover
  const imageUrl = vehicle.image || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80`;

  return (
    <div
      id={`vehicle-card-${vehicle._id}`}
      className="group relative bg-dark-800/80 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
    >
      
      {/* Vehicle Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-dark-900">
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
            {vehicle.category}
          </span>
        </div>

        {/* Live Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span id={`stock-badge-${vehicle._id}`} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/90 text-white backdrop-blur-md shadow-lg shadow-red-500/20">
              Out of Stock
            </span>
          ) : (
            <span id={`stock-badge-${vehicle._id}`} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-lg shadow-emerald-500/20">
              In Stock: {vehicle.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Vehicle Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              {vehicle.year}
            </span>
          </div>

          {vehicle.vin && (
            <p className="text-[11px] text-gray-500 font-mono tracking-wider uppercase mb-2">
              VIN: {vehicle.vin}
            </p>
          )}

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {vehicle.description || `${vehicle.year} ${vehicle.make} ${vehicle.model} in pristine condition. Certified luxury vehicle.`}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">MSRP Price</span>
            <span className="text-xl font-extrabold text-white tracking-tight">{formattedPrice}</span>
          </div>

          {/* Purchase Button */}
          <button
            id={`purchase-btn-${vehicle._id}`}
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isOutOfStock
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-dark-900 shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
          </button>
        </div>

        {/* Admin Action Control Toolbar (Visible exclusively for Admin users) */}
        {isAdmin && (
          <div className="pt-2 border-t border-gray-800/50 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Admin
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                id={`restock-btn-${vehicle._id}`}
                onClick={() => onRestock(vehicle)}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors"
                title="Restock Inventory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restock</span>
              </button>
              <button
                id={`edit-btn-${vehicle._id}`}
                onClick={() => onEdit(vehicle)}
                className="px-2.5 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center gap-1 transition-colors"
                title="Edit Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                id={`delete-btn-${vehicle._id}`}
                onClick={() => onDelete(vehicle)}
                className="p-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
