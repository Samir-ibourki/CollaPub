import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

interface TokenPayload {
  userId: string;
  role: string;
}

const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || "default_super_secret_jwt_key";
  const expiresIn = process.env.JWT_EXPIRE || "7d";
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const authService = {
  
  async register(input: RegisterInput) {
    
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("This email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        passwordHash,
        role: input.role,
        ...(input.phoneNumber ? { phoneNumber: input.phoneNumber } : {}),
        ...(input.role === "CREATOR"
          ? {
              creatorProfile: {
                create: {
                  country: "Morocco",
                },
              },
            }
          : {
              brandProfile: {
                create: {
                  companyName: input.companyName || input.fullName,
                  country: "Morocco",
                },
              },
            }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        creatorProfile: true,
        brandProfile: true,
      },
    });


    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      user,
      token,
    };
  },

  
  async login(input: LoginInput) {

    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        creatorProfile: true,
        brandProfile: true,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }


    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }


    const token = generateToken({
      userId: user.id,
      role: user.role,
    });


    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  
  
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        creatorProfile: {
          include: {
            socialAccounts: true,
          },
        },
        brandProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};
