import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Office Cab Booking Service API',
      version: '1.0.0',
      description: 'API documentation for the Office Cab Booking Service',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            model: { type: 'string' },
            licensePlate: { type: 'string' },
            capacity: { type: 'integer' },
            type: { 
              type: 'string',
              enum: ['SEDAN', 'SUV', 'VAN']
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateVehicleDto: {
          type: 'object',
          required: ['model', 'licensePlate', 'capacity', 'type'],
          properties: {
            model: { type: 'string' },
            licensePlate: { type: 'string' },
            capacity: { type: 'integer' },
            type: {
              type: 'string',
              enum: ['SEDAN', 'SUV', 'VAN']
            }
          }
        },
        UpdateVehicleDto: {
          type: 'object',
          properties: {
            model: { type: 'string' },
            licensePlate: { type: 'string' },
            capacity: { type: 'integer' },
            type: {
              type: 'string',
              enum: ['SEDAN', 'SUV', 'VAN']
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE']
            }
          }
        },
        VehicleResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Vehicle' }
          }
        },
        Location: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            latitude: { type: 'number', format: 'float' },
            longitude: { type: 'number', format: 'float' },
            address: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            vehicleId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateLocationDto: {
          type: 'object',
          required: ['latitude', 'longitude', 'vehicleId'],
          properties: {
            latitude: { type: 'number', format: 'float' },
            longitude: { type: 'number', format: 'float' },
            address: { type: 'string' },
            vehicleId: { type: 'string', format: 'uuid' }
          }
        },
        LocationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Location' }
          }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Drivers', description: 'Driver management endpoints' },
      { name: 'Vehicles', description: 'Vehicle management endpoints' },
      { name: 'Locations', description: 'Location management endpoints' },
      { name: 'Bookings', description: 'Booking management endpoints' },
      { name: 'Trips', description: 'Trip management endpoints' },
      { name: 'SOS', description: 'SOS request endpoints' },
      { name: 'Incidents', description: 'Incident management endpoints' },
    ],
  },
  apis: ['./src/routes/v1/*.ts'], // Path to the API routes
}; 