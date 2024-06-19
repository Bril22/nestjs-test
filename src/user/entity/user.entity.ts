import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  hash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
