import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFontDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  createdBy?: string;
}

export class UpdateFontDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  path?: string;
}
