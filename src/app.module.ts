import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBCONFIG } from './db/db.config.js';
import { ConfigModule } from '@nestjs/config';
import { BleModule } from './ble/ble.module.js';
import { AnimalModule } from './animals/animal.module.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: DBCONFIG
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BleModule,
    AnimalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
