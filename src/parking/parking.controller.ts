import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkCarDto } from './dto/park-car.dto';

@Controller('parking')
export class ParkingController {
    // Injecting ParkingService Dependency
    constructor(private readonly parkingService: ParkingService) {}

    // Parking Lot - Create, Expand, Clear, Status
    @Post('init/:size')
    initParkingLot(@Param('size') size: string) {
        return this.parkingService.initParkingLot(+size);
    }

    @Patch('expand/:size')
    expandParkingLot(@Param('size') size: string) {
        return this.parkingService.expandParkingLot(+size);
    }

    @Get('clear')
    clearParkingLot() {
        return this.parkingService.clearParkingLot();
    }

    @Get('status')
    getStatusOfAllSlots() {
        return this.parkingService.getStatusOfAllSlots();
    }

    // Park a car
    @Post('park')
    @UsePipes(new ValidationPipe())
    parkCar(@Body() parkCarDto: ParkCarDto) {
        return this.parkingService.parkCar(parkCarDto);
    }

    // Exit a car from a slot
    @Post('exit/:slotId')
    exitCar(@Param('slotId') slotId: string) {
        return this.parkingService.exitCar(+slotId);
    }

    // Get All occupied slots
    @Get('occupied')
    getAllOccupiedSlots() {
        return this.parkingService.getOccupiedSlots();
    }

    // Get Registration Numbers of car with given color
    @Get('registration/:carColor')
    getRegistrationNumberByCarColor(@Param('carColor') carColor: string) {
        return this.parkingService.getRegistrationNumberByColor(carColor);
    }

    // Get slot of the car with given registration number
    @Get('slot/:registrationNumber')
    getSlotByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
        return this.parkingService.getSlotByRegistrationNumber(registrationNumber);
    }

    // Get slots which have given car color
    @Get('slots/:carColor')
    getSlotsByCarColor(@Param('carColor') carColor: string) {
        return this.parkingService.getSlotsByCarColor(carColor);
    }
}
