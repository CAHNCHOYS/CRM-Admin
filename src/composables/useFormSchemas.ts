import * as yup from "yup";

export const useFormSchemas = () => {
  const loginSchema = yup.object({
    email: yup.string().required("Поле обязательное для ввода").email("Введите правильный email"),
    password: yup.string().required("Поле обязательное для ввода").min(4, "Минимум 4 символа")
  });

  const registerSchema = yup.object({
    name: yup.string().required("Поле обязательное для ввода").min(4, "Введите нормальное имя"),
    email: yup.string().required("Поле обязательное для ввода").email("Введите правильный email"),
    city: yup.string().required("Выберете вашу страну"),
    password: yup.string().required("Поле обязательное для ввода").min(4, "Минимум 4 символа"),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password")], "Пароли должны совпадать"),
    agreement: yup
      .boolean()
      .required("Согласитесь на обработку данных")
 
      .oneOf([true], "Согласитесь на обработку данных")
  });

  return { loginSchema, registerSchema };
};
