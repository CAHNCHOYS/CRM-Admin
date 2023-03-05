
export type registerResponse = {
    success?: boolean, 
    alreadyRegistered?: boolean, //Если введеный емаили уже есть в бд
    error?: string,
}
