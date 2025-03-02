import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingSlot } from './models/parking-slot.model';
import { ParkCarDto } from './dto/park-car.dto';
import { Car } from './models/car.model';
import { Ticket } from './models/ticket.model';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ParkingService {
    // deprecated - using hashmaps to improve time complexity
    // private parkingLot: ParkingSlot[] = [];

    // Parking Slot related hash maps
    private slotMap: Map<number, ParkingSlot> = new Map();
    private registrationMap: Map<string, number> = new Map();
    private colorMap: Map<string, Set<number>> = new Map();

    // Ticket related hash maps
    private ticketMap: Map<string, Ticket> = new Map();
    private activeTicketsMap: Map<string, Ticket> = new Map();
    private closedTicketMap: Map<string, Ticket> = new Map();

    // Price per second
    private pricePerSecond = 10;

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

            this.slotMap.set(i, slot);
        }

        return Array.from(this.slotMap.values());
    }

    // Expand parking lot
    expandParkingLot(size: number): ParkingSlot[] {
        // check if size is greater than 0
        if(size <= 0) throw new BadRequestException(`Size must be greater than 0`);

        const currentSize = this.slotMap.size;
        for(let i=currentSize+1; i <= currentSize+size; i++) {
            const slot: ParkingSlot = {
                id: i,
                occupied: false,
                car: null,
            };

            this.slotMap.set(i,slot);
        }

        return Array.from(this.slotMap.values());
    }

    // Clear/reset parking lot (parkinglot = [])
    clearParkingLot(): {message: string} {
        this.slotMap.clear();
        this.registrationMap.clear();
        this.colorMap.clear();
        return {message: "Parking lot cleared successfully"};
    }

    // Park a car
    parkCar(parkCarDto: ParkCarDto): Ticket | {message: string} {

        // Check if car is already parked or not
        if(this.registrationMap.has(parkCarDto.registrationNumber)) 
            throw new BadRequestException(`Car with registration number ${parkCarDto.registrationNumber} is already parked`);

        // Get the lowest parking slot available
        for(let [slotId, slot] of this.slotMap.entries()) {
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

                // Update registration map about new parked car
                this.registrationMap.set(parkCarDto.registrationNumber, slotId);

                // Update colorMap
                const newColor = parkCarDto.color.toLowerCase();

                // if no car exists with this color then add it
                if(!this.colorMap.has(newColor)) this.colorMap.set(newColor, new Set());

                this.colorMap.get(newColor)?.add(slotId);

                // Return the slot details - deprecated: added ticket system so it returns ticket
                // return slot;

                // creating a ticket
                const ticket: Ticket = {
                    ticketId: uuidv4(),
                    slotId: slotId,
                    carDetails: newCar,
                    status: 'active',
                    createdAt: new Date().toISOString()
                };

                // adding to ticketMap
                this.ticketMap.set(ticket.ticketId, ticket);

                // adding to activeTicketMap
                this.activeTicketsMap.set(ticket.ticketId, ticket);

                // return the ticket
                return ticket;
            }
        }

        // Out of the loop found no free slot, return  message
        return {message: 'No available parking slot available'};
    }

    // Exit a Car
    exitCar(id: number): Ticket | {message: string} {
        const slot = this.slotMap.get(id);
        if(!slot) throw new BadRequestException(`No slot exists with slot id ${id}`);
        if(!slot.occupied) throw new BadRequestException(`No car is parked at slot ${id}`);

        const car = slot.car!;
        const color = car.color.toLowerCase();

        // remove from registrationMap
        this.registrationMap.delete(car.registrationNumber);

        // Remove from colorMap
        this.colorMap.get(color)?.delete(id);

        // clean the color map if empty
        if(this.colorMap.get(color)?.size === 0)
            this.colorMap.delete(color);

        slot.car = null;
        slot.occupied = false;

        // update the ticket and return it, compare from slotId
        for(const ticket of this.activeTicketsMap.values()) {
            if(ticket.slotId === id) {
                ticket.exitedAt = new Date().toISOString();
                const miliSeconds = new Date(ticket.exitedAt).getTime() - new Date(ticket.createdAt).getTime();
                const bill = this.pricePerSecond * (miliSeconds/1000);
                ticket.bill = bill;
                ticket.status = 'closed';

                // now add it to closedTicket and remove from active ticket
                this.activeTicketsMap.delete(ticket.ticketId);
                this.closedTicketMap.set(ticket.ticketId, ticket);

                return ticket;
            }
        }

        return {message: `No car found with id ${id}`};
    }

    // Fetching Details
    getOccupiedSlots(): ParkingSlot[] {
        const occupiedSlots: ParkingSlot[] = [];
        
        for(let slot of this.slotMap.values()) {
            if(slot.occupied) occupiedSlots.push(slot);
        }

        return occupiedSlots;
    }

    getStatusOfAllSlots(): ParkingSlot[] {
        return Array.from(this.slotMap.values());
    }
    
    getRegistrationNumberByColor(carColor: string): string[] | {message: string}{
        // first checking if any car parked with the given color
        const slotsSet = this.colorMap.get(carColor.toLowerCase());
        if(!slotsSet || slotsSet.size === 0)
            throw new BadRequestException(`No car found with color ${carColor}`);

        let registrationNumbers: string[] = [];
        // iterating through the slots where that car color exists
        for(const slotId of slotsSet) {
            const slot = this.slotMap.get(slotId);
            if(slot && slot.car) registrationNumbers.push(slot.car.registrationNumber);
        }

        return registrationNumbers;
    }

    getSlotByRegistrationNumber(carRegistrationNumber: string): ParkingSlot | {message: string} {
        const slotId = this.registrationMap.get(carRegistrationNumber);
        
        if(slotId === undefined)
            throw new BadRequestException(`No car found with registration ${carRegistrationNumber}`);

        const slot = this.slotMap.get(slotId);
        return slot ?? {message: `No car found at slot id ${slotId} `}; 
    }

    getSlotsByCarColor(carColor: string): ParkingSlot[] {
        const slotsSet = this.colorMap.get(carColor.toLowerCase());
        if(!slotsSet) return [];

        const slots: ParkingSlot[] = [];

        for(const slotId of slotsSet) {
            const slot = this.slotMap.get(slotId);
            if(slot) slots.push(slot);
        }
        return slots;
    }

    // === Ticket System ===
    getAllParkingTickets(): Ticket[] {
        return Array.from(this.ticketMap.values());
    }

    getTicketById(ticketId: string): Ticket | {message: string}{
        const ticket = this.ticketMap.get(ticketId);
        return ticket ?? {message: `No ticket found with id ${ticketId}`};
    }

    getActiveTickets(): Ticket[] {
        return Array.from(this.activeTicketsMap.values());
    }

    getClosedTickets(): Ticket[] {
        return Array.from(this.closedTicketMap.values());
    }
}
