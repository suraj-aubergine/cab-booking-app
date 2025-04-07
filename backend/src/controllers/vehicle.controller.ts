import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createResponse } from '../utils/response';

export const vehicleController = {
  async getVehicles(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          registrationNumber: 'asc'
        }
      });
      
      return res.json(createResponse(vehicles));
    } catch (error) {
      console.error('Get vehicles error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch vehicles'));
    }
  },

  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      if (!vehicle) {
        return res.status(404).json(createResponse(null, 'Vehicle not found'));
      }

      return res.json(createResponse(vehicle));
    } catch (error) {
      console.error('Get vehicle by id error:', error);
      return res.status(500).json(createResponse(null, 'Failed to fetch vehicle'));
    }
  },

  async createVehicle(req: Request, res: Response) {
    try {
      const vehicle = await prisma.vehicle.create({
        data: req.body
      });

      return res.status(201).json(createResponse(vehicle));
    } catch (error) {
      console.error('Create vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to create vehicle'));
    }
  },

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: req.body
      });

      return res.json(createResponse(vehicle));
    } catch (error) {
      console.error('Update vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to update vehicle'));
    }
  },

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({ where: { id } });
      return res.json(createResponse({ success: true }));
    } catch (error) {
      console.error('Delete vehicle error:', error);
      return res.status(500).json(createResponse(null, 'Failed to delete vehicle'));
    }
  }
}; 