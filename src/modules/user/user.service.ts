import { StringValue } from "ms";
import { compare, hash } from "bcryptjs";
import {
	AuthError,
	InternalServerError,
	NotFoundError,
} from "../../errors/standartError";
import { UserServiceContract } from "./types/user.contracts";
import { UserRepository } from "./user.repository";
import { sign } from "jsonwebtoken";
import { ENV } from "../../config/env";
import { ALL_VERIFICATION_ATTEMPTS } from "../../config/verification";
import { transporter } from "../../config/mail";
import { AlbumRepository } from "./@x";


export const UserService: UserServiceContract = {
	async login(credentials) {
		const user = await UserRepository.findByEmailWithPassword(
			credentials.email,
		);
		if (!user) {
			throw new NotFoundError("User");
		}
		const isMatched = await compare(credentials.password, user.password);
		if (!isMatched) {
			throw new AuthError("Passwords do not match");
		}
		const token = sign({ id: user.id }, ENV.JWT_ACCESS_SECRET_KEY, {
			expiresIn: ENV.JWT_EXPIRES_IN as StringValue,
		});

		return { token };
	},
	async register(credentials) {
		const existingUser = await UserRepository.findByEmail(
			credentials.email,
		);
		if (existingUser) {
			throw new InternalServerError("User with such email");
		}
		const hashedPassword = await hash(credentials.password, 10);
		const createdUser = await UserRepository.create({
			...credentials,
			password: hashedPassword,
		});
		const token = sign({ id: createdUser.id }, ENV.JWT_ACCESS_SECRET_KEY, {
			expiresIn: ENV.JWT_EXPIRES_IN as StringValue,
		});
        const code = String(Math.round(100000 + Math.random() * 899998))
        ALL_VERIFICATION_ATTEMPTS[createdUser.id] = code
        transporter.sendMail({
            from: 'Some Network App',
            to: credentials.email,
            subject: "Verifying email",
            text: `Hello, this email is about finishing creating your account. Here is the code: ${code}`
        });

		AlbumRepository.createAlbum("Мої фото", "", createdUser.id, 0, true)

		return { token };
	},
	async me(dto) {
		const user = await UserRepository.findById(dto.userId);
		if (!user) {
			throw new NotFoundError("User");
		}
		return user;
	},
    async modify(userId, newData, filename){
        const user = await UserRepository.findById(userId)
        if (!user){
			throw new NotFoundError("User");
        }
		if (filename){
			console.log("Takoe sebe")
			await UserRepository.createAvatar(userId, filename)
			const myAlbum = await AlbumRepository.getUserPersonalAlbum(userId)
			await AlbumRepository.createAlbumImage(filename, filename, myAlbum.id)
		}
        return await UserRepository.modify(userId, {...newData})
    },
    async verify(userId, verificationCode){
        console.log(`FULL LOG: \n\tCODE: ${verificationCode}\n\tID: ${userId}\n\tCODES: `)
        console.log(ALL_VERIFICATION_ATTEMPTS)
        const user = await UserRepository.findById(userId)
        if (!user){
            console.log("NO USER!")
			throw new NotFoundError("User");
        }
        if (ALL_VERIFICATION_ATTEMPTS[String(userId)] === verificationCode){
            console.log("COMPLETED")
            UserRepository.modify(userId, {verified: true})
            return true
        }
        return false
    },
	async getProfile(userId, myId) {
		return await UserRepository.getProfile(userId, myId)
	},
};