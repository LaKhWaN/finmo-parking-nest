import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingSlot } from './models/parking-slot.model';
import { ParkCarDto } from './dto/park-car.dto';
import { Car } from './models/car.model';

@Injectable()
export class ParkingService {
    private parkingLot: ParkingSlot[] = [];

    // Initialize parkingLot with given size
    initParkingLot(size: number): ParkingSlot[] {

        // check if size is positive number
        if(size <= 0) throw new BadRequestException(`Size must be greater than 0`);

        for(let i=1; i<=size; i++) {
            const slot: ParkingSlot = {
                id: i,
                occupied: false,
                car: null,
            };

            this.parkingLot.push(slot);
        }

        return this.parkingLot;
    }

    // Expand parking lot
    expandParkingLot(size: number): ParkingSlot[] {
        // check if size is greater than 0
        if(size <= 0) throw new BadRequestException(`Size must be greater than 0`);

        const currentSize = this.parkingLot.length;
        for(let i=currentSize+1; i <= currentSize+size; i++) {
            const slot: ParkingSlot = {
                id: i,
                occupied: false,
                car: null,
            };

            this.parkingLot.push(slot);
        }

        return this.parkingLot;
    }

    // Clear/reset parking lot (parkinglot = [])
    clearParkingLot(): {message: string} {
        this.parkingLot = [];
        return {message: "Parking lot cleared successfully"};
    }

    // Park a car
    parkCar(parkCarDto: ParkCarDto): ParkingSlot | {message: string} {

        // Check if car is already parked or not
        const isCarAlreadyParked = this.parkingLot.some(slot => slot.car?.registrationNumber === parkCarDto.registrationNumber);
        if(isCarAlreadyParked) throw new BadRequestException(`Car is already parked with registration number ${parkCarDto.registrationNumber}`);

        // Get the lowest parking slot available
        for(let i=0; i<this.parkingLot.length; i++) {
            const slot = this.parkingLot[i];

            if(!slot.occupied) {
                // Park the car here

                // Creating Car
                const newCar: Car = {
                    registrationNumber: parkCarDto.registrationNumber,
                    color: parkCarDto.color,
                };

                // Update the car in the slot
                slot.car = newCar;
                slot.occupied = true;

                // Break out of the loop
                return this.parkingLot[i];
            }
        }

        // Out of the loop found no free slot, return  message
        return {message: 'No available parking slot available'};
    }

    // Exit a Car
    exitCar(id: number): {message: string} {
        const size = this.parkingLot.length;

        if(id < 1 || id > size) throw new BadRequestException(`Slot id must be between 1 and ${size}`);

        if(this.parkingLot[id-1].car == null) throw new BadRequestException(`No car is parked at slot ${id}`);

        this.parkingLot[id-1].car = null;
        this.parkingLot[id-1].occupied = false;

        return {message: `Car exited sucessfully at slot ${id}`};
    }

    // Fetching Details
    getOccupiedSlots(): ParkingSlot[] {
        return this.parkingLot.filter(slot => slot.occupied);
    }

    getStatusOfAllSlots(): ParkingSlot[] {
        return this.parkingLot;
    }
    
    getRegistrationNumberByColor(carColor: string): string[] | {message: string}{
        let registrationNumbers: string[] = [];
        this.parkingLot.forEach((slot) => {
            if(slot.car?.color.toLowerCase() === carColor.toLowerCase()) registrationNumbers.push(slot.car.registrationNumber);
        })
        
        if(registrationNumbers.length === 0) return {message: `No car found with color ${carColor}`}
        return registrationNumbers;
    }

    getSlotByRegistrationNumber(carRegistrationNumber: string): ParkingSlot | {message: string} {
        const slot = this.parkingLot.find((slot) => slot.car?.registrationNumber === carRegistrationNumber);
        if(slot) return slot;
        return {message: `No car found with registration number ${carRegistrationNumber}`};
    }

    getSlotsByCarColor(carColor: string): ParkingSlot[] {
        let slots: ParkingSlot[] = [];

        this.parkingLot.forEach((slot) => {
            if(slot.car?.color.toLowerCase() === carColor.toLowerCase()) slots.push(slot);
        });

        return slots;
    }
}
