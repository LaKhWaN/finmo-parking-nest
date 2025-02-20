# Parking Lot Management System

A simple Parking Lot Management System built with **NestJS**. This project allows users to manage parking slots, park cars, exit cars, and query slot details.

## 🚀 Deployed Link

[Deployed App](https://finmo-parking-nest.onrender.com/)

## 💻 GitHub Repository

[GitHub Repo](https://github.com/LaKhWaN/finmo-parking-nest)

## 📬 Postman Collection

[Test APIs on Postman](https://finmo-parking.postman.co/workspace/Finmo-Parking-Workspace~ece1f1d4-8cea-49fa-8a18-66d72b120f52/collection/34287110-0e15c297-5e4f-43f5-b645-2bb12095fda2)

## 📖 Features

- Initialize and expand parking lots.
- Park and exit cars from slots.
- Check status of all parking slots.
- Retrieve slots based on car color or registration number.
- Get a list of all occupied slots.

## 📋 API Endpoints

| Method | Endpoint                            | Description                                       | Request Body                                |
| ------ | ----------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| POST   | `/parking/init/:size`               | Initialize parking lot with given size            | `size` as URL parameter                     |
| POST   | `/parking/expand/:size`             | Expand parking lot by given size                  | `size` as URL parameter                     |
| GET    | `/parking/clear`                    | Clear all parking slots                           | None                                        |
| GET    | `/parking/status`                   | Get status of all parking slots                   | None                                        |
| POST   | `/parking/park`                     | Park a car in an available slot                   | `{ "registrationNumber": "", "color": "" }` |
| POST   | `/parking/exit/:slotId`             | Remove a car from a slot                          | `slotId` as URL parameter                   |
| GET    | `/parking/occupied`                 | Get all occupied slots                            | None                                        |
| GET    | `/parking/registration/:carColor`   | Get registration numbers of cars by color         | `carColor` as URL parameter                 |
| GET    | `/parking/slot/:registrationNumber` | Get slot number by car registration number        | `registrationNumber` as URL parameter       |
| GET    | `/parking/slots/:carColor`          | Get all slot numbers for cars of a specific color | `carColor` as URL parameter                 |

## 🏗️ Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LaKhWaN/finmo-parking-nest
   cd finmo-parking-nest
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app:**

   ```bash
   npm run start:dev
   ```

4. **Access API at:**

   ```bash
   http://localhost:3000
   ```

## 🐳 Docker Setup

1. **Build Docker Image:**

   ```bash
   docker build -t parking-lot .
   ```

2. **Run Docker Container:**

   ```bash
   docker run -p 3000:3000 parking-lot
   ```

## 🛠️ Tech Stack

- **NestJS**
- **TypeScript**
- **Docker**

---

Feel free to contribute or raise issues! 🚗✨
