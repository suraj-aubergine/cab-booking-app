import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateLocationDto, UpdateLocationDto } from '../types/location';
import { prisma } from '../index';

const prismaClient = new PrismaClient();

export const locationController = {
  // Get location history for a vehicle
  async getLocationHistory(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const locations = await prismaClient.location.findMany({
        where: { vehicleId },
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: true,
        },
      });

      res.json({ success: true, data: locations });
    } catch (error) {
      console.error('Error fetching location history:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch location history' });
    }
  },

  // Get current location of a vehicle
  async getCurrentLocation(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const location = await prismaClient.location.findFirst({
        where: { vehicleId },
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: true,
        },
      });

      if (!location) {
        return res.status(404).json({ success: false, error: 'Location not found' });
      }

      res.json({ success: true, data: location });
    } catch (error) {
      console.error('Error fetching current location:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch current location' });
    }
  },

  // Update vehicle location
  async updateLocation(req: Request, res: Response) {
    try {
      const locationData: CreateLocationDto = req.body;
      
      // Verify vehicle exists
      const vehicle = await prismaClient.vehicle.findUnique({
        where: { id: locationData.vehicleId },
      });

      if (!vehicle) {
        return res.status(404).json({ success: false, error: 'Vehicle not found' });
      }
      const location = await prismaClient.location.create({
        data: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address || '',
          vehicleId: locationData.vehicleId,
          name: '', // Required field
          distanceFromOffice: 0, // Required field
          timestamp: new Date(),
        },
        include: {
          vehicle: true,
        },
      });

      res.json({ success: true, data: location });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ success: false, error: 'Failed to update location' });
    }
  },

  // Delete location (optional, might be needed for admin purposes)
  async deleteLocation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prismaClient.location.delete({
        where: { id },
      });

      res.json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ success: false, error: 'Failed to delete location' });
    }
  },

  // Get all locations (optional, might be needed for admin purposes)
  async getAllLocations(req: Request, res: Response) {
    try {
      const locations = await prisma.location.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          distanceFromOffice: true,
          latitude: true,
          longitude: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return res.json({
        success: true,
        data: locations
      });
    } catch (error) {
      console.error('Error fetching locations:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch locations'
        }
      });
    }
  },
}; 