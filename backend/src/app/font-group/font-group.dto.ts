import { IsNotEmpty, IsString, IsArray, ArrayMinSize, IsMongoId } from 'class-validator';

export class CreateFontGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'You must select at least 2 fonts to create a group.' })
  @IsMongoId({ each: true })
  fonts: string[];
  
  @IsNotEmpty()
  @IsMongoId()
  createdBy: string;
}

export class UpdateFontGroupDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'You must select at least 2 fonts to create a group.' })
  @IsMongoId({ each: true })
  fonts?: string[];
}
