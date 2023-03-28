import type { IUser, IUserNote, IUserProduct } from "./interfaces";


export type ApiError = {
  error: string;
};


//Ответы с backend если нет ошибки
export type RegisterResponse =  {
  readonly isSuccess: true; // Если регистрация успешна
};

export type LoginResponse = {
  //Если авторизация удалась получаем токен и объекьт пользователя

    token: string;
    user: IUser;

};

export type GetUserResponse = {
  user: IUser;
}
export type UpdateUserResponse = {
  readonly isInfoUpdated: true;
};



//Товары--------------------------------------------
export type GetProductsResponse = {
    products: IUserProduct[];
}


export type GetProductCategoriseResponse = {
    categories: {name: string, id: number}[];
}

export type NewProductResponse = {
  product: IUserProduct;
}
//--------------------------------------------------

export type GetNotesResponse = {
     notes: IUserNote[];    
}

export type UpdateNoteResponse = {
  isUpdated: true;
}

export type AddNoteResponse = {
  noteId: number;
}


//Generic ----------------
export type DeleteResponse = {
  isDeleted: true;
}

export type UpdateResponse = {
  isUpdated: true;
}