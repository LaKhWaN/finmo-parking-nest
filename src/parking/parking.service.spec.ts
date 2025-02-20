import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { BadRequestException } from '@nestjs/common';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initParkingLot', () => {
    it('should initialize parking lot with valid size', () => {
      const parkingLot = service.initParkingLot(5);
      expect(parkingLot.length).toBe(5);
      expect(parkingLot[0].occupied).toBe(false);
    });

    it('should throw error for size <= 0', () => {
      expect(() => service.initParkingLot(0)).toThrow(BadRequestException);
    });
  });

  describe('parkCar', () => {
    it('should park a car in an available slot', () => {
      service.initParkingLot(3);
      const result = service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
      
      if('occupied' in result) expect(result.occupied).toBe(true);
      else fail('Expected car to be park');
      
      expect(result.car?.registrationNumber).toBe('ABC123');
    });

    it('should not park if lot is full', () => {
      service.initParkingLot(1);
      service.parkCar({ registrationNumber: 'XYZ999', color: 'Blue' });
      const result = service.parkCar({ registrationNumber: 'DEF456', color: 'Green' });
      expect(result).toEqual({ message: 'No available parking slot available' });
    });

    it('should throw error if car is already parked', () => {
      service.initParkingLot(2);
      service.parkCar({ registrationNumber: 'DUP123', color: 'Black' });
      expect(() => service.parkCar({ registrationNumber: 'DUP123', color: 'Black' }))
        .toThrow(BadRequestException);
    });
  });

  describe('exitCar', () => {
    it('should remove a car from slot', () => {
      service.initParkingLot(2);
      service.parkCar({ registrationNumber: 'EXIT123', color: 'Yellow' });
      const exitResult = service.exitCar(1);
      expect(exitResult).toEqual({ message: 'Car exited sucessfully at slot 1' });
      expect(service.getOccupiedSlots().length).toBe(0);
    });

    it('should throw error for invalid slot ID', () => {
      service.initParkingLot(2);
      expect(() => service.exitCar(5)).toThrow(BadRequestException);
    });
  });

  describe('getRegistrationNumberByColor', () => {
    it('should return registration numbers by car color', () => {
      service.initParkingLot(3);
      service.parkCar({ registrationNumber: 'COLOR123', color: 'Red' });
      service.parkCar({ registrationNumber: 'COLOR456', color: 'Red' });
      const result = service.getRegistrationNumberByColor('Red');
      expect(result).toEqual(['COLOR123', 'COLOR456']);
    });

    it('should return message if no car found', () => {
      service.initParkingLot(2);
      const result = service.getRegistrationNumberByColor('Purple');
      expect(result).toEqual({ message: 'No car found with color Purple' });
    });
  });
});
