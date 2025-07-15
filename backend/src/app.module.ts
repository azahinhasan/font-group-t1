import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FontsModule } from './app/font/font.module';
import { LoggingModule } from './logging/logging.module';
import { FontGroupsModule } from './app/font-group/font-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'configs/.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      bufferCommands: false,
    }),
    FontsModule,
    FontGroupsModule,
    LoggingModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
