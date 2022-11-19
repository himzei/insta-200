import * as bcrypt from "bcrypt";
import client from "../../client";
import { createWriteStream, ReadStream, WriteStream } from "fs";
import { CommonResult } from "../../shared/shared.interface";
import { protectedResolver } from "../users.utils";

interface EditProfileArgs {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: any;
}

const resolverFn: any = async (
  _,
  {
    firstName,
    lastName,
    username,
    email,
    password: newPassword,
    bio,
    avatar,
  }: EditProfileArgs,
  // 3번째 인자 context from server.js
  { loggedInUser }
): Promise<CommonResult> => {
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar.file;
    const newFilename = `${loggedInUser.id}-${Date.now()}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename + filename
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

  if (!loggedInUser) {
    return {
      ok: false,
      error: "로그인 해야 합니다.",
    };
  }
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "profile 업데이트 할 수 없어요",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
