import { IsNotEmpty, IsString } from 'class-validator';

export class CollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
