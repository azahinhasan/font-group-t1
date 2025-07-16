import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FontsModule } from './app/font/font.module';
import { LoggingModule } from './logging/logging.module';
import { FontGroupsModule } from './app/font-group/font-group.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'configs/.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      bufferCommands: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    FontsModule,
    FontGroupsModule,
    LoggingModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
