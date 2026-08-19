import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IUpdateUser } from "./auth.interface"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { createUserTokens } from "../../helpers/authToken";
import { TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth";
import { AuthProvider, Role } from "../../../generated/prisma/enums";



const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.password === null && user.googleId !== null) {
		throw new Error(
			"User already has account register with google. Try to login with google",
		);
	}

    // password matching
    const isPasswordMatched = await bcrypt.compare(password, user.password as string);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect")
    }

    // jwt
    const { accessToken, refreshToken } = createUserTokens(user)

    return { accessToken, refreshToken };
}

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true },
        include: {
            technicianProfile: true
        }
    })

    return user;
}

const updateMyInfo = async (userId: string, payload: IUpdateUser) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    if (user.id !== userId) {
        throw new Error("You can only edit your id!")
    }

    return await prisma.user.update({
        where: { id: userId },
        data: payload,
        omit: { password: true }
    });
}

interface IUpdateProfile {
    bio: string;
    experience: number;
}
const updateTechnicianInfo = async (userId: string, payload: IUpdateProfile) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId },
    });

    if (technician.userId !== userId) {
        throw new Error("You can only edit your profile!")
    }

    return await prisma.technicianProfile.update({
        where: { id: userId },
        data: payload
    });
}

const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })

    if (user.status === "BANNED") {
        throw new Error("User is banned, please contact support!");
    }


    // generate new access token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const newAccessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    return {
        accessToken: newAccessToken
    }
}

export interface IGoogleLoginPayload {
	idToken: string;
}

const googleLogin = async (payload: IGoogleLoginPayload) => {
	// console.log("service hit");
	let googleIdTokenPayload: TokenPayload | null | undefined = null;
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google ID Token Verification Failed", error);
		throw new Error("Invalid or Expired Google ID Token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Invalid or Expired Google ID Token");
	}

	const ifStudentExistWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			googleId: googleIdTokenPayload.sub,
		},
	});

	if (!googleIdTokenPayload.email) {
		throw new Error("Google email not found");
	}
	if (!googleIdTokenPayload.name) {
		throw new Error("Google email username not found");
	}

	let user = ifStudentExistWithGoogleAuth;

	if (!ifStudentExistWithGoogleAuth) {
		const ifStudentExistWithCredential = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				authProvider: AuthProvider.CREDENTIAL,
			},
		});
		if (ifStudentExistWithCredential) {
			// if (!ifStudentExistWithCredential.emailVerified) {
			// 	throw new Error("Email not verified");
			// }
			// if (ifStudentExistWithCredential.status === UserStatus.BLOCKED) {
			// 	throw new Error("User is blocked");
			// }
			// if (
			// 	ifStudentExistWithCredential.isDeleted ||
			// 	ifStudentExistWithCredential.status === UserStatus.DELETED
			// ) {
			// 	throw new Error("User is deleted");
			// }

			user = await prisma.user.update({
				where: {
					id: ifStudentExistWithCredential.id,
				},
				data: {
					googleId: googleIdTokenPayload.sub,
				},
			});
		} else {
			// google register
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email: googleIdTokenPayload.email,
					role: Role.CUSTOMER,
					googleId: googleIdTokenPayload.sub,
					authProvider: AuthProvider.GOOGLE,
				},
			});
		}
	}

	if (!user) {
		throw new Error("User not found");
	}

	// if (user.status === UserStatus.BLOCKED) {
	// 	throw new Error("User is blocked");
	// }
	// if (user.isDeleted || user.status === UserStatus.DELETED) {
	// 	throw new Error("User is deleted");
	// }

    const { accessToken, refreshToken } = createUserTokens(user)

	return { accessToken, refreshToken };
};


export const authService = {
    loginUser,
    getMyProfileFromDB,
    updateMyInfo,
    refreshToken,
    updateTechnicianInfo,
    googleLogin
}