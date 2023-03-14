import type { IUser, IUserProduct } from "./interfaces";


export type ApiError = {
  error: string;
};


//Ответы с backend если нет ошибки
export type RegisterResponse =  {
  readonly isSuccess: boolean; // Если регистрация успешна
};

export type LoginResponse = {
  //Если авторизация удалась получаем токен и объекьт пользователя
  readonly userTokenData: {
    token: string;
    user: IUser;
  };
};

export type VerifyTokenResponse = {
  readonly userData: IUser; // Если токен прошел валидацию то возвращаем декодированый токен, а это объект IUser
};

export type UpdateUserResponse = {
  readonly isInfoUpdated: boolean;
};

export type DeleteAccountResponse = {
  readonly isAccountDeleted: boolean;
};


//Товары--------------------------------------------
export type GetProductsResponse = {
    data: IUserProduct[];
}

export type DeleteProductResponse = {
  isProductDeleted: true;
}

export type GetProductCategoriseResponse = {
    data: {name: string, id: number}[];
}

export type UpdateUserProductResponse = {
  data: IUserProduct;
}

export type AddProductResponse = {
  data: IUserProduct;
}



//--------------------------------------------------