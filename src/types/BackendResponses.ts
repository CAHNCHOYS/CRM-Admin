import type { IUser } from "./interfaces";
//Ответы с api, в каждом будет  одно свойство из описанных

type ErrorResponse = {
  errorMessage?: string;
};

export type RegisterResponse = ErrorResponse & {
  readonly isSuccess?: true; // Если регистрация успешна
  readonly isUserAlreadyRegistered?: true; //Если введеный емаил уже есть в бд
};

export type LoginResponse = ErrorResponse & {
  readonly isWrongPassword?: true;
  readonly isNoExistEmail?: true;
  //Если авторизация удалась получаем токен и объекьт пользователя
  readonly userTokenData?: {
    token: string;
    user: IUser;
  };
};

export type VerifyTokenResponse = ErrorResponse & {
  readonly userData?: IUser; // Если токен прошел валидацию то возвращаем декодированый токен, а это объект IUser
  readonly isInvalidToken?: boolean;
};

export type UpdateTokenResponse = ErrorResponse & {
  readonly userTokenData?: {
    token: string;
    user: IUser;
  };
};

export type UpdateInfoResponse = ErrorResponse & {
  readonly isInfoUpdated?: true;
};

export type UpdatePasswordResponse = ErrorResponse & {
  readonly isWrongPassword?: true;
  readonly isPasswordUpdated?: string;
};

export type DeleteAccountResponse = ErrorResponse & {
  readonly isAccountDeleted?: true;
};
