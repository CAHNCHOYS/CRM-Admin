import type { IUser } from "./interfaces";
//Ответы с backend если нет ошибки

export type ErrorResponse = {
  errorMessage?: string;
};

export type ApiError = {
  error: string;
};

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
  readonly userData?: IUser; // Если токен прошел валидацию то возвращаем декодированый токен, а это объект IUser
  readonly isInvalidToken?: boolean;
};



export type UpdateInfoResponse = {
  readonly isInfoUpdated: boolean;
};



export type DeleteAccountResponse = {
  readonly isAccountDeleted: boolean;
};
