import * as yup from "yup";

export const useFormSchemas = () => {
  const loginSchema = yup.object({
    email: yup
      .string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    password: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов")
  });

  const registerSchema = yup.object({
    name: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Введите нормальное имя")
      .max(50, "Максимум 50 символов"),
    email: yup
      .string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    country: yup.string().required("Выберете вашу страну"),
    password: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(100, "Максимум 100 символов"),
    passwordConfirm: yup
      .string()
      .required("Поле обязательное для ввода")
      .oneOf([yup.ref("password")], "Пароли должны совпадать")
      .max(100, "Максимум 100 символов"),
    agreement: yup
      .boolean()
      .required("Согласитесь на обработку данных")

      .oneOf([true], "Согласитесь на обработку данных")
  });

  const updateInfoShchema = yup.object({
    name: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Введите нормальное имя")
      .max(50, "Максимум 50 символов"),
    email: yup
      .string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    country: yup.string().required("Выберете вашу страну"),
    avatar: yup
      .array<File>()
      .required("Выберете файл для аватара!")
      .min(1, "Выберете файл для аватара!")
  });

  const updatePasswordSchema = yup.object({
    oldPassword: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов"),
    newPassword: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов")
      .notOneOf([yup.ref("oldPassword")], "Новый пароль должен отличаться от старого!"),
    newPasswordConfirm: yup
      .string()
      .required("Поле обязательное для ввода")
      .oneOf([yup.ref("newPassword")], "Новый пароль должен совпадать")
  });

  return { loginSchema, registerSchema, updateInfoShchema, updatePasswordSchema };
};
