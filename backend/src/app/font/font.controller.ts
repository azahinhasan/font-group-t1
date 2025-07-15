import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { FontsService } from './font.service';
// import { AuthGuard } from '../../guard/jwt-auth.guard';
import { CreateFontDto, UpdateFontDto } from './font.dto';
import { GetIssuer } from '../../decorators/get-issuer.decorator';
import { PaginationDto } from '../../common/pagination.dto';

@Controller('font')
// @UseGuards(AuthGuard)
export class FontsController {
  constructor(private readonly fontsService: FontsService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.fontsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fontsService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @GetIssuer() issuer: any) {
    return this.fontsService.remove(id);
  }

  @Post('')
  @UseInterceptors(
    FileInterceptor('font', {
      storage: diskStorage({
        destination: './uploads/fonts',
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.ttf')) {
          return cb(new Error('Only .ttf files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFont(
    @UploadedFile() file: Express.Multer.File,
    @GetIssuer() issuer: any,
  ) {
    return this.fontsService.createFromUpload(file);
  }
}
