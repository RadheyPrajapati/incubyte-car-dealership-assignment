const { z } = require('zod');

const vehicleCategories = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Convertible',
  'Wagon',
  'Van',
  'Electric',
  'Hybrid'
];

exports.createVehicleSchema = z.object({
  make: z.string({ required_error: 'Make is required' }).min(1, 'Make cannot be empty').trim(),
  model: z.string({ required_error: 'Model is required' }).min(1, 'Model cannot be empty').trim(),
  year: z.number({ required_error: 'Year is required' }).int('Year must be an integer').min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 2, 'Invalid year'),
  category: z.enum(vehicleCategories, { errorMap: () => ({ message: 'Invalid vehicle category' }) }).optional().default('Sedan'),
  price: z.number({ required_error: 'Price is required' }).min(0, 'Price must be a non-negative number'),
  quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative').optional().default(1),
  vin: z.string().optional(),
  description: z.string().optional()
});
