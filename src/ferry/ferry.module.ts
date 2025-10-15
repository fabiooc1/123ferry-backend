import { Module } from '@nestjs/common';
import { FerryService } from './ferry.service';
import { FerryController } from './ferry.controller';
import { AdminFerryController } from './admin.ferry.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AdminFerryController, FerryController],
  providers: [FerryService],
  imports: [DatabaseModule],
})
export class FerryModule {}
