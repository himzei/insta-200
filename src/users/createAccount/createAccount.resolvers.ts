import client from "../../client";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

interface CreateAccountArgs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const Resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }: CreateAccountArgs
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("email/username 이미 사용하고 있습니다.");
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
      } catch (e) {
        return e;
      }
    },
  },
};

export default Resolvers;
