import { IUserModel } from "../../models/user";
import { generateJWT } from "./functions";

export const tokenBuilder = async (user: IUserModel) => {
  const accessToken = generateJWT(
    {
      id: user._id,
      role: user.email,
      tokenType: 'access',
    },
    {
      issuer: user.email,
      subject: user.email,
      audience: 'root',
    },
  );

  return {
    accessToken: accessToken,
  };
};
