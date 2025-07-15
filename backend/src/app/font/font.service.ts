import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Font, FontDocument } from './font.schema';
import { CreateFontDto, UpdateFontDto } from './font.dto';
import { LoggingsService } from '../../logging/logging.service';
import { PaginationDto } from 'src/common/pagination.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FontsService {
  constructor(
    @InjectModel(Font.name) private fontModel: Model<FontDocument>,
    private readonly logsService: LoggingsService,
  ) {}

  async createFromUpload(file: Express.Multer.File) {
    const dto: CreateFontDto = {
      name: file.originalname.replace('.ttf', ''),
      filename: file.filename,
      path: `/uploads/fonts/${file.filename}`,
    };

    return this.create(dto);
  }

  async create(dto: CreateFontDto) {
    const session = await this.fontModel.db.startSession();
    session.startTransaction();
    try {
      const font = await this.fontModel.create([{ ...dto }], { session });

      await this.logsService.create('CREATE_FONT', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return font[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this.logsService.create('CREATE_FONT', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to create font');
    }
  }
  async findAll(pagination: PaginationDto) {
    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const limit =
      pagination.limit && pagination.limit > 0 ? pagination.limit : 10;
    const skip = (page - 1) * limit;

    const session = await this.fontModel.db.startSession();
    session.startTransaction();

    try {
      const fonts = await this.fontModel
        .find()
        .skip(skip)
        .limit(limit)
        .session(session)
        .exec();

      const total = await this.fontModel.countDocuments().session(session);

      await session.commitTransaction();
      session.endSession();

      return {
        data: fonts,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch fonts');
    }
  }

  async findOne(id: string) {
    const session = await this.fontModel.db.startSession();
    session.startTransaction();
    try {
      const font = await this.fontModel.findById(id).session(session);
      if (!font) throw new NotFoundException('Font not found');

      await this.logsService.create('GET_FONT_BY_ID', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return font;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this.logsService.create('GET_FONT_BY_ID', 'FAILED');
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch font');
    }
  }

  async update(dto: UpdateFontDto, userId: string) {
    const session = await this.fontModel.db.startSession();
    session.startTransaction();
    try {
      const font = await this.fontModel.findById(dto.id).session(session);
      if (!font) throw new NotFoundException('Font not found');

      const updated = await this.fontModel
        .findByIdAndUpdate(dto.id, dto, { new: true, session })
        .exec();

      await this.logsService.create('UPDATE_FONT', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return updated;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      await this.logsService.create('UPDATE_FONT', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to update font');
    }
  }

  async remove(id: string) {
    const session = await this.fontModel.db.startSession();
    session.startTransaction();
    try {
      const font = await this.fontModel.findById(id).session(session);
      if (!font) throw new NotFoundException('Font not found');

      const deleted = await this.fontModel
        .findByIdAndDelete(id, { session })
        .exec();
      const filePath = path.join(
        __dirname,
        '../../../uploads/fonts',
        font.filename,
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete font file:', err.message);
        }
      });

      await this.logsService.create('DELETE_FONT', 'SUCCESS');
      await session.commitTransaction();
      session.endSession();

      return deleted;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      await this.logsService.create('DELETE_FONT', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to delete font');
    }
  }
}
