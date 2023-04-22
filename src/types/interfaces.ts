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
  readonly id: number;
  readonly name: string;
}

export type NoteType = "В процессе" | "Сделать потом" | "Сделано";

export interface IUserNote {
  readonly id: number;
  title: string;
  type: NoteType;
}

export interface IUserCustomer {
  readonly id: number;
  firstName: string;
  secondName: string;
  thirdName: string;
  fullName: string;
  phone: string;
  premium: "Да" | "Нет";
}

export interface IUserOrder {
  readonly id: number;
  productName: string;
  productId: number;
  productCount: number;
  customerFullName: string;
  customerId: number;
  date: string;
}
