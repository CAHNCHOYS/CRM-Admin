//Пользователь системы
export interface IUser {
  readonly id: number;
  name: string;
  email: string;
  password: string;
  country: string;
  avatar: string;
}

export interface IUserProduct {
  readonly id: number;
  name: string;
  price: number;
  count: number;
  category: string;
  categoryId: number;
}

export interface IUserProductCategory {
  id: number;
  name: string;
}

export type NoteType = "В процессе" | "Сделать потом" | "Сделано";

export interface IUserNote {
  readonly id: number;
  title: string;
  type: NoteType;
}

export interface IUserClient {
  readonly id: number;
  firstName: string;
  secondName: string;
  thirdName: string;
  phone: string;
  premium: 0 | 1;
}
