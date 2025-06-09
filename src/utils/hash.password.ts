import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class HashPassword {
    handleHashPassword = (password: string) => {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        return hash;
    };
    handleComparePassword = (passwordFromClient: string, hashPasswordFromDatabase: string) => {
        return compareSync(passwordFromClient, hashPasswordFromDatabase);
    };
}
