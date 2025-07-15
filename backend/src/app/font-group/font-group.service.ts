import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FontGroup, FontGroupDocument } from './font-group.schema';
import { CreateFontGroupDto, UpdateFontGroupDto } from './font-group.dto';
import { LoggingsService } from '../../logging/logging.service';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class FontGroupsService {
  constructor(
    @InjectModel(FontGroup.name)
    private fontGroupModel: Model<FontGroupDocument>,
    private readonly logsService: LoggingsService,
  ) {}

  async create(dto: CreateFontGroupDto) {
    const session = await this.fontGroupModel.db.startSession();
    session.startTransaction();
    try {
      const fontGroup = await this.fontGroupModel.create([{ ...dto }], {
        session,
      });

      await this.logsService.create('CREATE_FONT_GROUP', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return fontGroup[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this.logsService.create('CREATE_FONT_GROUP', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to create font group');
    }
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const limit =
      pagination.limit && pagination.limit > 0 ? pagination.limit : 10;
    const skip = (page - 1) * limit;

    const session = await this.fontGroupModel.db.startSession();
    session.startTransaction();

    try {
      const fontGroups = await this.fontGroupModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('fonts')
        .session(session)
        .exec();

      const total = await this.fontGroupModel.countDocuments().session(session);

      await session.commitTransaction();
      session.endSession();

      return {
        data: fontGroups,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch font groups');
    }
  }
  async findOne(id: string) {
    const fontGroup = await this.fontGroupModel
      .findById(id)
      .populate('fonts')
      .exec();
    if (!fontGroup) throw new NotFoundException('Font group not found');
    return fontGroup;
  }

  async update(dto: UpdateFontGroupDto) {
    const session = await this.fontGroupModel.db.startSession();
    session.startTransaction();

    try {
      const fontGroup = await this.fontGroupModel
        .findById(dto.id)
        .session(session);
      if (!fontGroup) throw new NotFoundException('Font group not found');

      const updated = await this.fontGroupModel
        .findByIdAndUpdate(dto.id, dto, { new: true, session })
        .exec();

      await this.logsService.create('UPDATE_FONT_GROUP', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return updated;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this.logsService.create('UPDATE_FONT_GROUP', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to update font group');
    }
  }

  async remove(id: string) {
    const session = await this.fontGroupModel.db.startSession();
    session.startTransaction();

    try {
      const fontGroup = await this.fontGroupModel.findById(id).session(session);
      if (!fontGroup) throw new NotFoundException('Font group not found');

      const deleted = await this.fontGroupModel
        .findByIdAndDelete(id, { session })
        .exec();

      await this.logsService.create('DELETE_FONT_GROUP', 'SUCCESS');

      await session.commitTransaction();
      session.endSession();

      return deleted;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      await this.logsService.create('DELETE_FONT_GROUP', 'FAILED');
      console.error(error);
      throw new InternalServerErrorException('Failed to delete font group');
    }
  }

  async fontPresentInGroup(id: string) {
    const exists = await this.fontGroupModel.exists({
      fonts: new Types.ObjectId(id),
    });

    return !!exists;
  }
}
