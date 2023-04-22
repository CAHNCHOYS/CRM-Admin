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

  const userProductSchema = yup.object({
    name: yup
      .string()
      .required("Введите имя товара")
      .min(2, "Минимум 2 символа")
      .max(125, "Слишком длинное название"),
    categoryId: yup.number().required("Выберете категорию!"),

    count: yup
      .number()
      .typeError("Введите нормальное число")
      .integer("Введите целое число")
      .required("Введите количество товара")
      .min(0, "Число должно быть положительным")
      .max(999999, "Слишком  большое число"),
    price: yup
      .number()
      .typeError("Введите нормальное число")
      .integer("Введите целое число")
      .required("Введите цену товара")
      .min(0, "Число должно быть положительным")
      .max(999999, "Слишком  большое число")
  });

  const userCustomerSchema = yup.object({
    firstName: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинное Имя!"),
    secondName: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинная Фамилия!"),
    thirdName: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(2, "Миниум 2 символа!")
      .max(50, "Слишком длинное Отчество!"),
    phone: yup
      .string()
      .required("Поле обязательное для ввода")
      .min(6, "Миниум 6 символов!")
      .max(30, "Введите телефон покороче"),
    premium: yup.string<"Да" | "Нет">().required("Есть ли премиум").default("Да")
  });

  const userOrderSchema = yup.object({
    productCount: yup
      .number()
      .typeError("Введите число")
      .required("Введите количество товара")
      .min(1, "Минимум 1 товар")
      .max(999999, "Слишком большое число"),
    customerId: yup.number().typeError("Выберете клиента").required("Выберете клиента"),
    productId: yup.number().typeError("Выберете клиента").required("Выберете товар"),
    date: yup
      .date()
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
