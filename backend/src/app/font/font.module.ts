import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FontsService } from './font.service';
import { Font, FontSchema } from './font.schema';
import { FontsController } from './font.controller';
import { AuthClientModule } from '../../modules/auth-client.module';
import { LoggingModule } from 'src/logging/logging.module';
import { FontGroupsModule } from '../font-group/font-group.module';
import { FontGroupsService } from '../font-group/font-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Font.name, schema: FontSchema }]),
    AuthClientModule,
    LoggingModule,
    FontGroupsModule
  ],
  controllers: [FontsController],
  providers: [FontsService,FontGroupsService],
})
export class FontsModule {}
