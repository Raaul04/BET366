import { ObjectId, OptionalId } from "npm:mongodb";

export type User = {
  id: string;
  name: string;
  age: number;
  email: string;
};

export interface UserSaldo {
  _id?: ObjectId;
  name: string;
  email: string;
  age: number;
  bets: number;
}

export type Apuesta = {
  _id?: ObjectId;
  userId: string;
  email: string;

  partido: {
    equipoLocal: string;
    equipoVisitante: string;
    fecha: string; 
    hora: string;
  };

  cuotas: Record<string, string>; 

  seleccion: "home" | "draw" | "away";
  cuota: string;
  monto: number;
  fecha: string | Date; // depende cómo lo uses
  resultado?: "home" | "draw" | "away";
  acertada?: boolean;
  resuelta?: boolean;
};

export type Partido = {
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  cuotas: {
    home: string;
    draw: string;
    away: string;
  };
};

export type ApuestaDB = OptionalId<Apuesta>;
export type UserDB = OptionalId<Omit<User, "id">>;
