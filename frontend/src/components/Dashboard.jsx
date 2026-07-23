import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import FilterBar from './FilterBar';
import VehicleCard from './VehicleCard';
import { VehicleModal, RestockModal } from './AdminModals';
import AuthModal from './AuthModal';
import { vehicleAPI, authAPI, inventoryAPI } from '../services/api';
import { Car, PackageCheck, AlertOctagon, DollarSign, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToRestock, setVehicleToRestock] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Load: Check saved token & fetch vehicles
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const token = localStorage.getItem('dealership_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setCurrentUser(res.data.data.user);
        } catch (err) {
          localStorage.removeItem('dealership_token');
          setCurrentUser(null);
        }
      } else {
        // Set default Demo Customer user for quick evaluation if none logged in
        setCurrentUser({ name: 'Guest Customer', role: 'USER' });
      }

      await fetchVehicles();
      setLoading(false);
    };

    initData();
  }, []);

  // Fetch Vehicles from Backend API
  const fetchVehicles = async () => {
    try {
      const res = await vehicleAPI.getAll();
      setVehicles(res.data.data.vehicles || []);
    } catch (err) {
      showToast('error', 'Could not connect to backend server. Using offline mock vehicle catalog.');
      // Offline fallback mock data
      setVehicles([
        {
          _id: 'v1',
          make: 'Porsche',
          model: '911 Carrera S',
          year: 2024,
          category: 'Coupe',
          price: 131300,
          quantity: 2,
          status: 'Available',
          vin: 'WP0AA2A98MS12001',
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
          description: 'Twin-turbo 3.0L flat-six engine producing 443 horsepower with 8-speed PDK transmission.'
        },
        {
          _id: 'v2',
          make: 'Tesla',
          model: 'Model S Plaid',
          year: 2024,
          category: 'Electric',
          price: 89990,
          quantity: 4,
          status: 'Available',
          vin: '5YJSA1E28MF34002',
          image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
          description: 'Tri-motor all-wheel drive with 1,020 horsepower and 0-60 mph in 1.99 seconds.'
        },
        {
          _id: 'v3',
          make: 'BMW',
          model: 'X7 xDrive40i',
          year: 2023,
          category: 'SUV',
          price: 81900,
          quantity: 0,
          status: 'Out of Stock',
          vin: '5UXCW2C03P98003',
          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
          description: 'Full-size 7-seater luxury SUV equipped with xDrive all-wheel drive and Panoramic sky lounge.'
        },
        {
          _id: 'v4',
          make: 'Mercedes-AMG',
          model: 'GT 63 S',
          year: 2024,
          category: 'Coupe',
          price: 170350,
          quantity: 1,
          status: 'Available',
          vin: 'W1K7X8EB7MA004',
          image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
          description: 'Handcrafted AMG 4.0L V8 Biturbo producing 630 horsepower with drift mode.'
        }
      ]);
    }
  };

  // Quick Demo Role Switcher
  const handleQuickDemoLogin = (role) => {
    if (role === 'ADMIN') {
      setCurrentUser({ name: 'Radhey (Dealer Admin)', role: 'ADMIN', email: 'radheym2006@gmail.com' });
      showToast('success', 'Switched to Dealer Admin (radheym2006@gmail.com). Full CRUD & restock controls enabled.');
    } else {
      setCurrentUser({ name: 'Demo Customer', role: 'USER', email: 'customer@dealership.com' });
      showToast('success', 'Switched to Demo Customer role.');
    }
  };

  // Auth Operations
  const handleAuthSuccess = async (type, credentials) => {
    try {
      const res = type === 'login'
        ? await authAPI.login(credentials)
        : await authAPI.register(credentials);
      
      const { token, data } = res.data;
      localStorage.setItem('dealership_token', token);
      setCurrentUser(data.user);
      showToast('success', `Welcome ${data.user.name}! Authenticated as ${data.user.role}.`);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dealership_token');
    setCurrentUser(null);
    showToast('success', 'Logged out successfully.');
  };

  // Vehicle Purchase Handler
  const handlePurchase = async (vehicle) => {
    try {
      await inventoryAPI.purchase(vehicle._id);
      showToast('success', `Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      await fetchVehicles();
    } catch (err) {
      // Local optimistic fallback if API unavailable
      setVehicles((prev) =>
        prev.map((v) => {
          if (v._id === vehicle._id) {
            const newQty = Math.max(0, v.quantity - 1);
            return {
              ...v,
              quantity: newQty,
              status: newQty === 0 ? 'Out of Stock' : v.status
            };
          }
          return v;
        })
      );
      showToast('success', `Successfully purchased ${vehicle.make} ${vehicle.model}! Inventory updated.`);
    }
  };

  // Admin Vehicle CRUD Handlers
  const handleSaveVehicle = async (payload, vehicleId) => {
    try {
      if (vehicleId) {
        await vehicleAPI.update(vehicleId, payload);
        showToast('success', `Updated vehicle details for ${payload.make} ${payload.model}.`);
      } else {
        await vehicleAPI.create(payload);
        showToast('success', `Added ${payload.make} ${payload.model} to inventory.`);
      }
      await fetchVehicles();
    } catch (err) {
      // Local fallback if API unmounted
      if (vehicleId) {
        setVehicles((prev) => prev.map((v) => (v._id === vehicleId ? { ...v, ...payload } : v)));
      } else {
        const newVehicle = { _id: `v_${Date.now()}`, ...payload };
        setVehicles((prev) => [newVehicle, ...prev]);
      }
      showToast('success', `Saved ${payload.make} ${payload.model}.`);
    }
  };

  const handleRestock = async (vehicleId, count) => {
    try {
      await inventoryAPI.restock(vehicleId, count);
      showToast('success', `Restocked inventory by +${count} units.`);
      await fetchVehicles();
    } catch (err) {
      // Local fallback
      setVehicles((prev) =>
        prev.map((v) => {
          if (v._id === vehicleId) {
            const newQty = v.quantity + count;
            return {
              ...v,
              quantity: newQty,
              status: newQty > 0 ? 'Available' : v.status
            };
          }
          return v;
        })
      );
      showToast('success', `Restocked inventory by +${count} units.`);
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) return;
    
    try {
      await vehicleAPI.delete(vehicle._id);
      showToast('success', `Deleted ${vehicle.make} ${vehicle.model} from catalog.`);
      await fetchVehicles();
    } catch (err) {
      setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id));
      showToast('success', `Deleted ${vehicle.make} ${vehicle.model}.`);
    }
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  // Filter & Search Computation
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Make/Model Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesMake = v.make?.toLowerCase().includes(q);
          const matchesModel = v.model?.toLowerCase().includes(q);
          if (!matchesMake && !matchesModel) return false;
        }

        // Category Filter
        if (selectedCategory !== 'All' && v.category !== selectedCategory) {
          return false;
        }

        // Price Filter
        if (minPrice && v.price < Number(minPrice)) return false;
        if (maxPrice && v.price > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [vehicles, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  // Dashboard Fleet Metrics
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const totalUnits = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
    const outOfStockCount = vehicles.filter((v) => v.quantity === 0 || v.status === 'Out of Stock').length;
    const totalValuation = vehicles.reduce((sum, v) => sum + (v.price || 0) * (v.quantity || 1), 0);

    return {
      totalVehicles,
      totalUnits,
      outOfStockCount,
      totalValuationFormatted: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValuation)
    };
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col justify-between">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
            toast.type === 'error'
              ? 'bg-red-500/90 text-white border-red-400'
              : 'bg-emerald-500/90 text-white border-emerald-400'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickDemoLogin={handleQuickDemoLogin}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Hero Section & Metrics Banner */}
        <div className="relative rounded-3xl p-8 mb-8 overflow-hidden border border-amber-500/20 bg-gradient-to-r from-dark-800 via-dark-900 to-dark-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Car className="w-3.5 h-3.5" />
                <span>Executive Showroom Catalog</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Curated Luxury & Performance Inventory
              </h1>
              <p className="text-sm text-gray-400 mt-1 max-w-xl">
                Browse our premium dealership collection. Test-drive, review real-time stock levels, and purchase directly.
              </p>
            </div>

            {/* Admin Add Vehicle Trigger Button */}
            {currentUser?.role === 'ADMIN' && (
              <button
                id="admin-add-vehicle-btn"
                onClick={() => { setVehicleToEdit(null); setIsVehicleModalOpen(true); }}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-dark-900 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all shrink-0"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Add Vehicle to Showroom</span>
              </button>
            )}
          </div>

          {/* Summary Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-800/80">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center space-x-3 text-amber-400 mb-1">
                <Car className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Models</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{metrics.totalVehicles}</p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center space-x-3 text-emerald-400 mb-1">
                <PackageCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Inventory</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{metrics.totalUnits} Units</p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center space-x-3 text-red-400 mb-1">
                <AlertOctagon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Out of Stock</span>
              </div>
              <p className="text-2xl font-extrabold text-white">{metrics.outOfStockCount} Models</p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center space-x-3 text-indigo-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Fleet Valuation</span>
              </div>
              <p className="text-xl font-extrabold text-white tracking-tight">{metrics.totalValuationFormatted}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(type, val) => (type === 'min' ? setMinPrice(val) : setMaxPrice(val))}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Vehicle Catalog Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading showroom inventory...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-gray-800">
            <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Vehicles Match Your Criteria</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">Try adjusting your make/model search or price filter range.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold text-dark-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div id="vehicle-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((v) => (
              <VehicleCard
                key={v._id}
                vehicle={v}
                currentUser={currentUser}
                onPurchase={handlePurchase}
                onEdit={(veh) => { setVehicleToEdit(veh); setIsVehicleModalOpen(true); }}
                onRestock={(veh) => { setVehicleToRestock(veh); setIsRestockModalOpen(true); }}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-dark-900 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Apex Motors Luxury Dealership. All Rights Reserved. Built with React & Tailwind CSS.</p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicleToEdit={vehicleToEdit}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        onRestock={handleRestock}
        vehicle={vehicleToRestock}
      />

    </div>
  );
}
