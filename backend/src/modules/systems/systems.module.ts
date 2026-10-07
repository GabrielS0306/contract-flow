import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SystemsController } from './systems.controller.js'
import { SystemsService } from './systems.service.js'
import { System, SystemSchema } from './schemas/system.schema.js'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: System.name,
                schema: SystemSchema,
            },
        ]),
    ],
    controllers: [SystemsController],
    providers: [SystemsService],
    exports: [SystemsService],
})
export class SystemsModule {}