import type { VerifyTokenResponse } from "@/types/BackendResponses";

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
  console.log(token);
  try {
    const response = await fetch("http://localhost:3000/api/VerifyToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    const json: VerifyTokenResponse = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return { isInvalidToken: true };
  }
};
