import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../components/VehicleCard';

describe('VehicleCard Component Unit Tests', () => {
  const mockVehicleInStock = {
    _id: 'v1',
    make: 'Porsche',
    model: '911',
    year: 2024,
    category: 'Coupe',
    price: 120000,
    quantity: 3,
    status: 'Available'
  };

  const mockVehicleOutOfStock = {
    _id: 'v2',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    category: 'Electric',
    price: 40000,
    quantity: 0,
    status: 'Out of Stock'
  };

  it('should enable Purchase button when quantity > 0', () => {
    const handlePurchase = vi.fn();
    render(
      <VehicleCard
        vehicle={mockVehicleInStock}
        currentUser={{ role: 'USER' }}
        onPurchase={handlePurchase}
      />
    );

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).not.toBeDisabled();

    fireEvent.click(purchaseBtn);
    expect(handlePurchase).toHaveBeenCalledWith(mockVehicleInStock);
  });

  it('should disable Purchase button with Sold Out label when quantity === 0', () => {
    const handlePurchase = vi.fn();
    render(
      <VehicleCard
        vehicle={mockVehicleOutOfStock}
        currentUser={{ role: 'USER' }}
        onPurchase={handlePurchase}
      />
    );

    const purchaseBtn = screen.getByRole('button', { name: /sold out/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('should show Admin actions exclusively when user role is ADMIN', () => {
    const { rerender } = render(
      <VehicleCard
        vehicle={mockVehicleInStock}
        currentUser={{ role: 'USER' }}
      />
    );

    // Customer user should NOT see Admin buttons
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();

    // Rerender with ADMIN user
    rerender(
      <VehicleCard
        vehicle={mockVehicleInStock}
        currentUser={{ role: 'ADMIN' }}
        onEdit={() => {}}
        onRestock={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });
});
