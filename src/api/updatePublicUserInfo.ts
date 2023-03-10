import type { UpdateInfoResponse  } from "@/types/BackendResponses";

export const updatePublicUserInfo = async (obj: FormData): Promise<UpdateInfoResponse > => {

  try {
    let response = await fetch("http://localhost:3000/api/UpdateUserInfo", {
      method: "PATCH",
      body: obj
    });

    let json:UpdateInfoResponse  = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return {
      errorMessage: (error as Error).message
    };
  }
};
