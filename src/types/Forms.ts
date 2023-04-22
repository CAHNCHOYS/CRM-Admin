export type RegisterFields = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  country: string;
  agreement: boolean;
};

export type LoginFields = {
  email: string;
  password: string;
};

export type UpdateInfoFields = {
  name: string;
  email: string;
  country: string;
  avatar: File[] | string;
};

export type UpdatePasswordFields = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type UserProductFields = {
  name: string;
  categoryId: number;
  count: number;
  price: number;
};

export type UserCustomerFields = {
  firstName: string;
  secondName: string;
  thirdName: string;
  phone: string;
  premium:  "Да" | "Нет";
};

export type UserOrderFields = {
  customerId: number;
  productId: number;
  productCount: number;
  date: string;
}
