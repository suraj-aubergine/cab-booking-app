import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResponse } from '../utils/response';

export const locationController = {
  async getLocations(req: Request, res: Response) {
    try {
      const locations = await prisma.location.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      
      return res.json(createResponse(locations));
    } catch (error) {
      console.error('Get locations error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch locations'));
    }
  },

  async getLocationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const location = await prisma.location.findUnique({
        where: { id }
      });

      if (!location) {
        return res.status(404).json(createResponse(null, 'Location not found'));
      }

      return res.json(createResponse(location));
    } catch (error) {
      console.error('Get location by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch location'));
    }
  },

  async createLocation(req: Request, res: Response) {
    try {
      const location = await prisma.location.create({
        data: req.body
      });

      return res.status(201).json(createResponse(location));
    } catch (error) {
      console.error('Create location error:', error);
      return res.status(500).json(createResponse(null, 'Failed to create location'));
    }
  },

  async updateLocation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const location = await prisma.location.update({
        where: { id },
        data: req.body
      });

      return res.json(createResponse(location));
    } catch (error) {
      console.error('Update location error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update location'));
    }
  },

  async deleteLocation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.location.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete location error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete location'));
    }
  },

  async getLocationHistory(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      
      const locationHistory = await prisma.locationHistory.findMany({
        where: {
          vehicleId
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
      
      return res.json(createResponse(locationHistory));
    } catch (error) {
      console.error('Get location history error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch location history'));
    }
  },

  async getCurrentLocation(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      
      const currentLocation = await prisma.locationHistory.findFirst({
        where: {
          vehicleId
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
      
      if (!currentLocation) {
        return res.status(404).json(createResponse(null, 'Current location not found'));
      }
      
      return res.json(createResponse(currentLocation));
    } catch (error) {
      console.error('Get current location error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch current location'));
    }
  }
}; 