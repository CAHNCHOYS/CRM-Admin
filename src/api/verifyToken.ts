
type VerifyTokenResponse = {
  isValidToken?: boolean;
  isInvalidToken?: boolean;
  errorMessage?: string;
}

export const verifyToken = async (token: string) :Promise<VerifyTokenResponse> => {

  try {
    let response = await fetch("http://localhost:3000/api/verifyToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({token})
    });


    let json: VerifyTokenResponse = await response.json();
    return json;

  } catch (error) {

    console.log(error);
     return {errorMessage : (error as Error).message}

  }
};
