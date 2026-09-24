import { compareSync, hashSync, genSaltSync } from "bcrypt";
import { sign, SignOptions, verify } from "jsonwebtoken";
import { User } from "../models/user.model.js";

export class Encrypter {
    secret: string;
    pepper: string;
    saltro: string;
    constructor(sec: string, pep: string, sal: number){
        this.secret = sec;
        this.pepper = pep;
        this.saltro = genSaltSync(sal);
    };

    GenerateHash(password: string): string {
        return hashSync(password+this.pepper, this.saltro);
    }

    ComparePassword(password: string, dbPassword: string): boolean {
        return compareSync(password+this.pepper, dbPassword);
    }

    GenerateJWT(userData: Partial<User>): string {
        const opt: SignOptions = {
            algorithm: "HS256",
        };
        return sign(userData, this.secret, opt);
    }

    VerifyJWT(jwt: string): boolean {
        try {
            verify(jwt, this.secret);
            return true;
        } catch {
            return false
        }
    }
};