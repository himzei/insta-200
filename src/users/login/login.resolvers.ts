import client from "../../client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { CommonResult } from "../../shared/shared.interface";

interface LoginArgs {
  username: string;
  password: string;
}

interface LoginResult extends CommonResult {
  token?: string;
}

export default {
  Mutation: {
    login: async (
      _,
      { username, password }: LoginArgs
    ): Promise<LoginResult> => {
      const user = await client.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        return {
          ok: false,
          error: "해당하는 username이 없습니다.",
        };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "잘못된 패스워드 입니다.",
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
