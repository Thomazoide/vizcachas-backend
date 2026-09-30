import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBCONFIG } from './db/db.config.js';
import { ConfigModule } from '@nestjs/config';
import { BleModule } from './ble/ble.module.js';
import { AnimalModule } from './animals/animal.module.js';
import { AlternativeModule } from './alternatives/alternative.module.js';
import { BadgeModule } from './badges/badge.module.js';
import { QuestionModule } from './questions/question.module.js';
import { TriviaModule } from './trivias/trivia.module.js';
import { TriviaBadgeModule } from './trivia-badges/trivia-badge.module.js';
import { TriviaCompletionModule } from './trivia-completions/trivia-completion.module.js';
import { UserBadgeModule } from './user-badges/user-badge.module.js';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
            useFactory: DBCONFIG
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BleModule,
    AnimalModule,
    AlternativeModule,
    BadgeModule,
    QuestionModule,
    TriviaModule,
    TriviaBadgeModule,
    TriviaCompletionModule,
    UserBadgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
