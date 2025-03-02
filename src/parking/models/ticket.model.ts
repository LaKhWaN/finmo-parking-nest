import { Car } from "./car.model";

export class Ticket {
    ticketId: string;
    slotId: number;
    carDetails: Car;
    createdAt: string;
    status: 'active' | 'closed';
    bill?: number;
    exitedAt?: string;
}