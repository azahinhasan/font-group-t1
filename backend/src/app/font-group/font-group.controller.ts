import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { FontGroupsService } from './font-group.service';
import { CreateFontGroupDto, UpdateFontGroupDto } from './font-group.dto';
import { GetIssuer } from '../../decorators/get-issuer.decorator';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('font-group')
export class FontGroupsController {
  constructor(private readonly fontGroupsService: FontGroupsService) {}

  @Post()
  create(@Body() dto: CreateFontGroupDto) {
    return this.fontGroupsService.create(dto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.fontGroupsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fontGroupsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFontGroupDto) {
    return this.fontGroupsService.update(id,dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fontGroupsService.remove(id);
  }
}
