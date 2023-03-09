import type { IUser } from "./interfaces";
//Ответы с api, в каждом будет  одно свойство из описанных

type ErrorResponse = {
  errorMessage?: string;
}

export type RegisterResponse = ErrorResponse & {
  readonly isSuccess?: true; // Если регистрация успешна
  readonly isUserAlreadyRegistered?: true; //Если введеный емаил уже есть в бд
};




export type LoginResponse = ErrorResponse & {
  isWrongPassword?: true;
  isNoExistEmail?: true;
     //Если авторизация удалась получаем токен и объекьт пользователя
  readonly userTokenData?: {
    token: string;
    user: IUser;
  };
};

export type VerifyTokenResponse = ErrorResponse & {
  userData?: IUser; // Если токен прошел валидацию то возвращаем декодированый токен, а это объект IUser
  isInvalidToken?: boolean;
};

export type UpdateTokenResponse = ErrorResponse & {
  readonly userTokenData?: {
    token: string;
    user: IUser;
  };
};


export type UpdateInfoResponse = ErrorResponse & {
  isInfoUpdated?: true;
};

export type UpdatePasswordResponse = ErrorResponse & {
    isWrongPassword?: true;
    newPassword?: string;
}


