import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Region } from "../components/map";
import axios, { AxiosInstance } from "axios";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

interface Price {
  amount: number;
  currency: string;
}

interface Cab {
  id?: string;
  model: string;
  color: string;
  plateNum: string;
}

interface Driver {
  id?: string;
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  bank?: string;
  bankBranch?: string;
  bankAccount?: string;
  avatar?: string;
  cab?: Cab;
  trips: Trip[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

enum TripResponseDTOMethod {
    CREDIT_CARD,
    CASH,
    PIX
}

enum TripResponseDTOStatus {
  REQUESTED,
  ACCEPTED,
  STARTED,
  COMPLETED,
  CANCELLED,
}

interface Payment {
    id: string;
    method: TripResponseDTOMethod;
    amount: number;
    createdAt: string;
}

interface TripResponseDTO {
  id: string;
  customer: Customer;
  driver: Driver;
  payment: Payment;
  status: TripResponseDTOStatus;
  origin: string;
  destination: string;
  createdAt: string;
}

const DRIVER_KEY = "@CurrentDriver";

class DriverStorageService {
  private API: AxiosInstance;

  constructor() {
    this.API = axios.create({
      baseURL: "http://localhost:8080/api",
    });
  }

  async saveDriver(driver: Driver): Promise<Driver | null> {
    try {
      const { data } = await this.API.post(
        "/auth/driver/register",
        {
          name: driver.name,
          email: driver.email,
          password: driver.password,
          dateOfBirth: driver.dateOfBirth,
          model: driver.cab?.model,
          color: driver.cab?.color,
          plateNum: driver.cab?.plateNum,
          bank: driver.bank,
          bankAccount: driver.bankAccount,
          bankBranch: driver.bankBranch,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[ID]: ", data.id);
      const driverJson = JSON.stringify(data);
      await AsyncStorage.setItem(DRIVER_KEY, driverJson);
      return data;
    } catch (error) {
      console.error("Error saving driver: ", error);
      return null;
    }
  }

  async editDriver(driver: Driver): Promise<Driver> {
    try {
      const driverJson = JSON.stringify(driver);
      await AsyncStorage.setItem(DRIVER_KEY, driverJson);
      return driver;
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

  async login(email: string, password: string): Promise<Driver | null> {
    try {
      const { data } = await this.API.post("/auth/login", {
        email,
        password,
      });
      this.API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      const res = await this.API.get(`/driver/getData/${email}`);
      return res.data;
    } catch (error: any) {
      if (error.response.status === 401) {
        return null;
      }

      throw error;
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

      await this.API.post(
        `/trip/${newTrip.id}/${
          newTrip.status === Status.COMPLETED ? "complete" : "cancel"
        }`
      );
    } catch (error) {
      console.error("Error adding trip to driver's history:", error);
      throw new Error("Failed to add trip");
    }
  }

  async getTrips(): Promise<TripResponseDTO[]> {
    try {
      const driver = await this.getDriver();
      if (!driver) {
        throw new Error("No driver logged in");
      }

      const res = await this.API.get(`/driver/getTripsHistory`);
      return res.data.content;
    } catch (error) {
      console.error("Error retrieving trips from AsyncStorage:", error);
      return [];
    }
  }

  async getTripsRequests(): Promise<TripResponseDTO[]> {
    try {
      const driver = await this.getDriver();
      if (!driver) {
        throw new Error("No driver logged in");
      }

      const res = await this.API.get(`/driver/getTripsRequests/${driver.id}`);
      return res.data.content;
    } catch (error) {
      console.error("Error retrieving trips from AsyncStorage:", error);
      return [];
    }
  }

  generateTrip(dto?: TripResponseDTO): Trip {
    const addresses: Region[] = [
      {
        name: "Rua José de Almeida, 300 - Catolé, Campina Grande",
        latitude: -7.241,
        longitude: -35.87,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Manoel Firmino da Silva, 150 - Malvinas, Campina Grande",
        latitude: -7.255,
        longitude: -35.895,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Antônio Luiz de França, 200 - Bodocongó, Campina Grande",
        latitude: -7.23,
        longitude: -35.85,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Severino José da Silva, 100 - Universitário, Campina Grande",
        latitude: -7.215,
        longitude: -35.91,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua José Guedes Cavalcanti, 250 - Mirante, Campina Grande",
        latitude: -7.205,
        longitude: -35.89,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Aprígio Nepomuceno, 200 - Palmeira, Campina Grande",
        latitude: -7.22,
        longitude: -35.865,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua José Paulino, 150 - Dinamérica, Campina Grande",
        latitude: -7.245,
        longitude: -35.885,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Maria José da Silva, 200 - Sandra Cavalcante, Campina Grande",
        latitude: -7.21,
        longitude: -35.87,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua Carlos Agra de Melo, 180 - Alto Branco, Campina Grande",
        latitude: -7.2,
        longitude: -35.88,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      {
        name: "Rua João Batista de Almeida, 250 - Lauritzen, Campina Grande",
        latitude: -7.25,
        longitude: -35.88,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
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
      ["Rafael Silva", "rafaelsilva@gmail.com"],
    ];

    const randomCustomerNumber = Math.floor(Math.random() * 10);
    const randomPriceNumber = parseFloat((Math.random() * 100 + 20).toFixed(2));
    const randomOriginNumber = Math.floor(Math.random() * 10);
    const randomDestinationNumber = Math.floor(Math.random() * 10);

    const customer: Customer = {
      id: uuidv4(),
      name: customers[randomCustomerNumber][0],
      email: customers[randomCustomerNumber][1],
      avatar: "https://thispersondoesnotexist.com/",
    };

    const newTrip: Trip = {
      id: dto?.id || uuidv4(),
      customer: dto?.customer || customer,
      payment: {
        amount: dto?.payment.amount || randomPriceNumber,
        currency: "BRL",
      },
      status: Status.PENDING,
      origin: {...addresses[randomOriginNumber], name: dto?.origin || addresses[randomOriginNumber].name},
      destination: {...addresses[randomDestinationNumber], name: dto?.destination || addresses[randomDestinationNumber].name},
    };

    return newTrip;
  }
}

export const driverStorageService = new DriverStorageService();
export { Customer, Driver, Price, Role, Status, Trip, TripResponseDTOStatus, TripResponseDTO };
