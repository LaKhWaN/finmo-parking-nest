import { Car } from "./car.model";

export class ParkingSlot {
    id: number;
    occupied: boolean;
    car: Car | null;
}