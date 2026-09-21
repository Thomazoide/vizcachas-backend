import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBCONFIG } from './db/db.config.js';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: DBCONFIG
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
