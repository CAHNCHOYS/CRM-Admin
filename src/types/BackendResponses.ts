import type { IUser, IUserCustomer, IUserNote, IUserOrder, IUserProduct } from "./interfaces";


export type ApiError = {
  error: string;
};

//Авторизация ---------------------------------------------------
export type RegisterResponse =  {
  readonly isSuccess: true; // Если регистрация успешна
};
export type UpdateAccessTokenResponse = {
  accessToken: string
}

export type GetUserResponse = {
  user: IUser;
}

export type LoginResponse = GetUserResponse & UpdateAccessTokenResponse;

//------------------------------------------------------------

//Товары--------------------------------------------
export type GetProductsResponse = {
    products: IUserProduct[];
}

export type GetProductCategoriseResponse = {
    categories: {name: string, id: number}[];
}

export type AddProductResponse = {
  productId: number;
 
}

//--------------------------------------------------

//Заметки ---------------------------------------
export type GetNotesResponse = {
     notes: IUserNote[];    
}


export type AddNoteResponse = {
  noteId: number;
}
//---------------------------------------------

//Клиенты -----------------------
export type GetCustomersResponse = {
  customers: IUserCustomer[];
}

export type AddCustomersResponse = {
  customerId: number;
}

//-------------------------------
//Заказы

export type GetOrdersResponse = {
  orders: IUserOrder[];
}

export type NewOrderResponse = {
  id: number;
  customerFullName: string;
  productName: string;
}

//---------------

//Generic ----------------
export type DeleteResponse = {
  isDeleted: true;
}

export type UpdateResponse = {
  isUpdated: true;
}
