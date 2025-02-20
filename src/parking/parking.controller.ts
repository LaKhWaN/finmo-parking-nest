import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkCarDto } from './dto/park-car.dto';

@Controller('parking')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    @Post('init/:size')
    initParkingLot(@Param('size') size: string) {
        return this.parkingService.initParkingLot(+size);
    }

    @Post('expand/:size')
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

    @Post('park')
    @UsePipes(new ValidationPipe())
    parkCar(@Body() parkCarDto: ParkCarDto) {
        return this.parkingService.parkCar(parkCarDto);
    }

    @Post('exit/:slotId')
    exitCar(@Param('slotId') slotId: string) {
        return this.parkingService.exitCar(+slotId);
    }

    @Get('occupied')
    getAllOccupiedSlots() {
        return this.parkingService.getOccupiedSlots();
    }

    @Get('registration/:carColor')
    getRegistrationNumberByCarColor(@Param('carColor') carColor: string) {
        return this.parkingService.getRegistrationNumberByColor(carColor);
    }

    @Get('slot/:registrationNumber')
    getSlotByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
        return this.parkingService.getSlotByRegistrationNumber(registrationNumber);
    }

    @Get('slots/:carColor')
    getSlotsByCarColor(@Param('carColor') carColor: string) {
        return this.parkingService.getSlotsByCarColor(carColor);
    }
}
