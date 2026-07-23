import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, RefreshCw, AlertCircle } from 'lucide-react';

// Modal for Adding or Editing Vehicle Details
export function VehicleModal({ isOpen, onClose, onSave, vehicleToEdit }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sedan',
    price: '',
    quantity: 1,
    description: '',
    vin: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        make: vehicleToEdit.make || '',
        model: vehicleToEdit.model || '',
        year: vehicleToEdit.year || new Date().getFullYear(),
        category: vehicleToEdit.category || 'Sedan',
        price: vehicleToEdit.price || '',
        quantity: vehicleToEdit.quantity || 1,
        description: vehicleToEdit.description || '',
        vin: vehicleToEdit.vin || '',
        image: vehicleToEdit.image || ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Sedan',
        price: '',
        quantity: 1,
        description: '',
        vin: '',
        image: ''
      });
    }
    setErrorMsg('');
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      };

      await onSave(payload, vehicleToEdit?._id);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-dark-800 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-dark-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {vehicleToEdit ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
            {vehicleToEdit ? 'Edit Vehicle Details' : 'Add New Vehicle to Inventory'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Make *</label>
              <input
                type="text"
                name="make"
                id="vehicle-make-input"
                required
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Porsche"
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Model *</label>
              <input
                type="text"
                name="model"
                id="vehicle-model-input"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 911 GT3"
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Year *</label>
              <input
                type="number"
                name="year"
                id="vehicle-year-input"
                required
                min={1900}
                max={2030}
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Category *</label>
              <select
                name="category"
                id="vehicle-category-select"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Wagon">Wagon</option>
                <option value="Van">Van</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Price ($) *</label>
              <input
                type="number"
                name="price"
                id="vehicle-price-input"
                required
                min={0}
                value={formData.price}
                onChange={handleChange}
                placeholder="45000"
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Initial Stock Quantity *</label>
              <input
                type="number"
                name="quantity"
                id="vehicle-quantity-input"
                required
                min={0}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">VIN (Optional)</label>
              <input
                type="text"
                name="vin"
                id="vehicle-vin-input"
                value={formData.vin}
                onChange={handleChange}
                placeholder="WP0ZZZ99ZTS..."
                className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              id="vehicle-image-input"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Description (Optional)</label>
            <textarea
              name="description"
              id="vehicle-description-input"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter key vehicle features, package details..."
              className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-dark-900 hover:bg-dark-700 rounded-lg border border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-vehicle-btn"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-dark-900 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : vehicleToEdit ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// Modal for Restocking Vehicle Inventory
export function RestockModal({ isOpen, onClose, onRestock, vehicle }) {
  const [restockCount, setRestockCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setRestockCount(1);
    setErrorMsg('');
  }, [isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await onRestock(vehicle._id, Number(restockCount));
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to restock vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-dark-800 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-dark-900/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Restock {vehicle.make} {vehicle.model}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400 mb-2">
              Current Stock: <strong className="text-amber-400">{vehicle.quantity} units</strong>
            </p>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Add Additional Units *
            </label>
            <input
              type="number"
              id="restock-count-input"
              min={1}
              required
              value={restockCount}
              onChange={(e) => setRestockCount(e.target.value)}
              className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 bg-dark-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-restock-btn"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-dark-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-400/20 disabled:opacity-50"
            >
              {loading ? 'Restocking...' : 'Confirm Restock'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
