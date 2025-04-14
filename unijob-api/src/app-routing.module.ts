import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from './common/modules/users/user.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './common/modules/auth/auth.module';

const routes: Routes = [
    {
        path: '/users',
        module: UserModule,
    },
    {
        path: '/auth',
        module: AuthModule,
    },
];

@Module({
    imports: [RouterModule.register(routes), UserModule, AuthModule],
})
export class AppRoutingModule { }
