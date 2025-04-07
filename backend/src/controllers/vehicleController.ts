import { Request, Response } from 'express';
import { prisma } from '../index';
import { VehicleType, VehicleStatus } from '@prisma/client';

export const vehicleController = {
  // Get all vehicles
  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        include: {
          Driver: true,
          locations: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
      });

      return res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch vehicles',
        },
      });
    }
  },

  // Get vehicle by ID
  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          Driver: true,
          locations: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Vehicle not found',
          },
        });
      }

      return res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch vehicle',
        },
      });
    }
  },

  // Create new vehicle
  async createVehicle(req: Request, res: Response) {
    try {
      const vehicle = await prisma.vehicle.create({
        data: {
          model: req.body.model,
          licensePlate: req.body.licensePlate,
          capacity: req.body.capacity,
          type: req.body.type as VehicleType,
          status: VehicleStatus.AVAILABLE,
        },
      });

      return res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create vehicle',
        },
      });
    }
  },

  // Update vehicle
  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: req.body,
      });

      return res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update vehicle',
        },
      });
    }
  },

  // Delete vehicle
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete vehicle',
        },
      });
    }
  },
}; 