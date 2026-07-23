import React from 'react';
import { Car, LogOut, LogIn, ShoppingBag } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onOpenPurchases }) {
  const isCustomer = currentUser && currentUser.role !== 'ADMIN';

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Dealership Logo & Branding */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Car className="w-6 h-6 text-dark-900 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">APEX</span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                MOTORS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Luxury & Performance Fleet</p>
          </div>
        </div>

        {/* User Profile Pill / Auth Actions */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              
              {/* My Purchases Button (Customer Only) */}
              {isCustomer && (
                <button
                  id="my-purchases-btn"
                  onClick={onOpenPurchases}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700/80 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>My Garage & Purchases</span>
                </button>
              )}

              <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-200 leading-none">{currentUser.name}</p>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                id="logout-btn"
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              id="login-register-btn"
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-lg shadow-amber-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
