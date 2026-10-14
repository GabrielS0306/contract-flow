import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ContractsController } from './contracts.controller.js'
import { ContractsService } from './contracts.service.js'
import { Contract, ContractSchema } from './schemas/contract.schema.js'
import { Client, ClientSchema } from '../clients/schemas/client.schema.js'
import { System, SystemSchema } from '../systems/schemas/system.schema.js'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Contract.name,
                schema: ContractSchema,
            },
            {
                name: Client.name,
                schema: ClientSchema,
            },
            {
                name: System.name,
                schema: SystemSchema,
            },
        ]),
    ],
    controllers: [ContractsController],
    providers: [ContractsService],
    exports: [ContractsService],
})

export class ContractsModule {}