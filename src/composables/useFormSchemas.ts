import { object, string, number, ref, date, array, boolean } from "yup";

export const useFormSchemas = () => {
  const loginSchema = object({
    email: string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    password: string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов")
  });

  const registerSchema = object({
    name: string()
      .required("Поле обязательное для ввода")
      .min(4, "Введите нормальное имя")
      .max(50, "Максимум 50 символов"),
    email: string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    country: string().required("Выберете вашу страну"),
    password: string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(100, "Максимум 100 символов"),
    passwordConfirm: string()
      .required("Поле обязательное для ввода")
      .oneOf([ref("password")], "Пароли должны совпадать")
      .max(100, "Максимум 100 символов"),
    agreement: boolean()
      .required("Согласитесь на обработку данных")

      .oneOf([true], "Согласитесь на обработку данных")
  });

  const updateInfoShchema = object({
    name: string()
      .required("Поле обязательное для ввода")
      .min(4, "Введите нормальное имя")
      .max(50, "Максимум 50 символов"),
    email: string()
      .required("Поле обязательное для ввода")
      .email("Введите правильный email")
      .max(50, "Максимум 50 символов"),
    country: string().required("Выберете вашу страну"),
    avatar: array<File>()
      .required("Выберете файл для аватара!")
      .min(1, "Выберете файл для аватара!")
  });

  const updatePasswordSchema = object({
    oldPassword: string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов"),
    newPassword: string()
      .required("Поле обязательное для ввода")
      .min(4, "Минимум 4 символа")
      .max(50, "Максимум 50 символов")
      .notOneOf([ref("oldPassword")], "Новый пароль должен отличаться от старого!"),
    newPasswordConfirm: string()
      .required("Поле обязательное для ввода")
      .oneOf([ref("newPassword")], "Новый пароль должен совпадать")
  });

  const userProductSchema = object({
    name: string()
      .required("Введите имя товара")
      .min(2, "Минимум 2 символа")
      .max(125, "Слишком длинное название"),
    categoryId: number().required("Выберете категорию!"),

    count: number()
      .typeError("Введите нормальное число")
      .integer("Введите целое число")
      .required("Введите количество товара")
      .min(0, "Число должно быть положительным")
      .max(999999, "Слишком  большое число"),
    price: number()
      .typeError("Введите нормальное число")
      .integer("Введите целое число")
      .required("Введите цену товара")
      .min(0, "Число должно быть положительным")
      .max(999999, "Слишком  большое число")
  });

  const userCustomerSchema = object({
    firstName: string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинное Имя!"),
    secondName: string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинная Фамилия!"),
    thirdName: string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинное Отчество!"),
    phone: string()
      .required("Поле обязательное для ввода")
      .min(6, "Миниум 6 символов!")
      .max(30, "Введите телефон покороче"),
    premium: string<"Да" | "Нет">().required("Есть ли премиум").default("Да")
  });

  const userOrderSchema = object({
    productCount: number()
      .typeError("Введите число")
      .required("Введите количество товара")
      .min(1, "Минимум 1 товар")
      .max(999999, "Слишком большое число"),
    customerId: number().typeError("Выберете клиента").required("Выберете клиента"),
    productId: number().typeError("Выберете клиента").required("Выберете товар"),
    date: date()
      .typeError("Введите дату")
      .required("Введите дату")
      .min("2023-00-00", "Минимум 23 год")
      .max("2027-00-00", "СМаксимум 2026 год")
  });

  return {
    loginSchema,
    registerSchema,
    updateInfoShchema,
    updatePasswordSchema,
    userProductSchema,
    userCustomerSchema,
    userOrderSchema
  };
};
