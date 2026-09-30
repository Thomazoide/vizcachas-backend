import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../models/user.model.js";
import { EntityNotFoundError, IsNull, Repository } from "typeorm";
import { Encrypter } from "../utils/encrypter.util.js";
import { ConfigService } from "@nestjs/config";
import { LoginPayload } from "../payloads/request.payloads.js";

@Injectable()
export class UserService {
    private readonly encrypter;
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
        private readonly env: ConfigService
    ){
        this.encrypter = new Encrypter(
            env.get<string>("SECRET")!,
            env.get<string>("PEPPER")!,
            Number(env.get<string>("SALT"))
        );
    };

    async GetAllUsers(): Promise<User[]> {
        return this.repo.find({
            where: {
                deleted_at: IsNull()
            }
        });
    }

    async CreateUser(user: Partial<User>): Promise<User> {
        const newUser = this.repo.create(user);
        newUser.password = this.encrypter.GenerateHash(user.password!);
        return this.repo.save(newUser);
    }

    async Login(payload: LoginPayload): Promise<string> {
        const findedUser = await this.repo.findOne({
            where: {
                email: payload.email
            }
        });
        if (!findedUser) throw new EntityNotFoundError(User, "");
        if (!this.encrypter.ComparePassword(payload.password, findedUser.password)) throw new Error("- Login Error (password o email incorrectos)");
        findedUser.password = "";
        return this.encrypter.GenerateJWT(findedUser);
    }

    async FindByID(userID: string): Promise<User> {
        const findedUser = await this.repo.findOne({
            where: {
                ID: userID
            }
        });
        if (!findedUser) throw new EntityNotFoundError(User, "");
        return findedUser;
    }

    async UpdateUser(userData: Partial<User>): Promise<User> {
        if (userData.password != null || userData.password !== "") throw new Error("* Esta funcion es solo para actualizar los datos que no sean la contraseña del usuario...");
        const findedUser = await this.repo.findOne({
            where: {
                ID: userData.ID
            }
        });
        if (!findedUser) throw new EntityNotFoundError(User, "");
        const updatedUser = userData;
        updatedUser.password = findedUser.password;
        return await this.repo.save(updatedUser);
    }

    async DeleteUser(userID: string): Promise<void> {
        const findedUser = await this.repo.findOne({
            where: {
                ID: userID,
                deleted_at: IsNull()
            }
        });
        if (!findedUser) throw new EntityNotFoundError(User, "");
        await this.repo.softDelete(findedUser.ID);
        return;
    }

    async FindByEmail(email: string): Promise<User> {
        const findedUser = await this.repo.findOne({
            where: {
                email
            }
        });
        if (!findedUser) throw new EntityNotFoundError(User, "");
        return findedUser;
    }
};
