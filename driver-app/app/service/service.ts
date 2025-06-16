import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Region } from '../components/map';

enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

enum Status {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}

interface Price {
    amount: number;
    currency: string;
}

interface Cab {
    id: string;
    model: string;
    color: string;
    plateNumber: string;
}

interface Driver {
    id?: string;
    name: string;
    email: string;
    password: string;
    birthDate: string;
    bank?: string;
    bankAccounBranch?: string;
    bancAccountNumber?: string;
    avatar?: string;
    cab?: Cab;
    trips: Trip[];
    role?: Role;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface Trip {
    id: string;
    customer: Customer;
    payment: Price;
    status: Status;
    origin: Region;
    destination: Region;
    rating?: number;
}

const DRIVER_KEY = "@CurrentDriver";

class DriverStorageService {
    async saveDriver(driver: Driver): Promise<Driver> {
        try {
            driver.id = uuidv4();
            driver.role = Role.USER;
            const driverJson = JSON.stringify(driver);
            await AsyncStorage.setItem(DRIVER_KEY, driverJson);
            return driver;
        } catch (error) {
            console.error("Error saving driver to AsyncStorage:", error);
            return null;
        }
    }

    async editDriver(driver: Driver): Promise<Driver> {
        try {
            const driverJson = JSON.stringify(driver);
            await AsyncStorage.setItem(DRIVER_KEY, driverJson);
        } catch (error) {
            console.error("Error editing driver to AsyncStorage:", error);
            throw new Error("Failed to edit driver");
        }
    }

    async getDriver(): Promise<Driver | null> {
        try {
            const driverJson = await AsyncStorage.getItem(DRIVER_KEY);
            if (driverJson) {
                return JSON.parse(driverJson) as Driver;
            }
            return null;
        } catch (error) {
            console.error("Error retrieving driver from AsyncStorage:", error);
            return null;
        }
    }

    async login(email: string, password: string): Driver | null {
        const loggedDriver = await this.getDriver();
        if (loggedDriver && loggedDriver.email === email.toLowerCase() && loggedDriver.password === password) {
            return loggedDriver;
        } else {
            return null;
        }
    }

    async clearDriver(): Promise<void> {
        try {
            await AsyncStorage.removeItem(DRIVER_KEY);
        } catch (error) {
            console.error("Error clearing driver from AsyncStorage:", error);
            throw new Error("Failed to clear driver");
        }
    }

    async addTripToHistory(newTrip: Trip): Promise<void> {
        try {
            const driver = await this.getDriver();
            if (!driver) {
                throw new Error("No driver logged in");
            }

            driver.trips = [...driver.trips, newTrip];
            await this.saveDriver(driver);
        } catch (error) {
            console.error("Error adding trip to driver's history:", error);
            throw new Error("Failed to add trip");
        }
    }

    async getTrips(): Promise<Trip[]> {
        try {
            const driver = await this.getDriver();
            return driver?.trips || [];
        } catch (error) {
            console.error("Error retrieving trips from AsyncStorage:", error);
            return [];
        }
    }

    generateTrip(): Trip {
        const addresses: Region[] = [
            {
                "name": "Rua José de Almeida, 300 - Catolé, Campina Grande",
                "latitude": -7.2410,
                "longitude": -35.8700,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Manoel Firmino da Silva, 150 - Malvinas, Campina Grande",
                "latitude": -7.2550,
                "longitude": -35.8950,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Antônio Luiz de França, 200 - Bodocongó, Campina Grande",
                "latitude": -7.2300,
                "longitude": -35.8500,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Severino José da Silva, 100 - Universitário, Campina Grande",
                "latitude": -7.2150,
                "longitude": -35.9100,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua José Guedes Cavalcanti, 250 - Mirante, Campina Grande",
                "latitude": -7.2050,
                "longitude": -35.8900,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Aprígio Nepomuceno, 200 - Palmeira, Campina Grande",
                "latitude": -7.2200,
                "longitude": -35.8650,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua José Paulino, 150 - Dinamérica, Campina Grande",
                "latitude": -7.2450,
                "longitude": -35.8850,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Maria José da Silva, 200 - Sandra Cavalcante, Campina Grande",
                "latitude": -7.2100,
                "longitude": -35.8700,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua Carlos Agra de Melo, 180 - Alto Branco, Campina Grande",
                "latitude": -7.2000,
                "longitude": -35.8800,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            },
            {
                "name": "Rua João Batista de Almeida, 250 - Lauritzen, Campina Grande",
                "latitude": -7.2500,
                "longitude": -35.8800,
                "latitudeDelta": 0.0922,
                "longitudeDelta": 0.0421
            }
        ];

        const customers: string[][] = [
            ["Ana Clara", "anaclara@gmail.com"],
            ["Pedro Santos", "pedrosantos@hotmail.com"],
            ["Julia Souza", "juliasouza@hotmail.com"],
            ["Lucas Oliveira", "lucasoliveira@gmail.com"],
            ["Marina Costa", "marinacosta@bol.com"],
            ["Gabriel Almeida", "gabrielalmeida@gmail.com"],
            ["Laura Mendes", "lauramendes@gmail.com"],
            ["Matheus Ferreira", "matheusferreira@gmail.com"],
            ["Sofia Lima", "sofialima@gmail.com"],
            ["Rafael Silva", "rafaelsilva@gmail.com"]
        ];

        const randomCustomerNumber = Math.floor(Math.random() * 10);
        const randomPriceNumber = (Math.random() * 100 + 20).toFixed(2);
        const randomOriginNumber = Math.floor(Math.random() * 10);
        const randomDestinationNumber = Math.floor(Math.random() * 10);

        const customer: Customer = {
            id: uuidv4(),
            name: customers[randomCustomerNumber][0],
            email: customers[randomCustomerNumber][1],
            avatar: "https://thispersondoesnotexist.com/"
        };

        const newTrip: Trip = {
            id: uuidv4(),
            customer: customer,
            payment: {
                amount: randomPriceNumber,
                currency: "BRL"
            },
            status: Status.PENDING,
            origin: addresses[randomOriginNumber],
            destination: addresses[randomDestinationNumber]
        };

        return newTrip;
    }
}

export const driverStorageService = new DriverStorageService();
export { Customer, Driver, Price, Role, Status, Trip };
