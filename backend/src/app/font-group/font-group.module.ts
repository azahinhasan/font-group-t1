import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FontGroup, FontGroupSchema } from './font-group.schema';
import { FontGroupsService } from './font-group.service';
import { FontGroupsController } from './font-group.controller';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FontGroup.name, schema: FontGroupSchema }]),
    LoggingModule,
  ],
  providers: [FontGroupsService],
  controllers: [FontGroupsController],
  exports: [FontGroupsService, MongooseModule],
})
export class FontGroupsModule {}
