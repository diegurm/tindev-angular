import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevSchema } from './models/dev.schema';

import { DevController } from './controllers/dev.controller';
import { LikeController } from './controllers/like.controller';
import { DislikeController } from './controllers/dislike.controller';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://omnistack:omnistack@cluster0-wzxsv.mongodb.net/omnistack8?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
      },
    ),
    MongooseModule.forFeature([{ name: 'Dev', schema: DevSchema }]),

  ],
  controllers: [
    DevController,
    LikeController,
    DislikeController,
  ],
  providers: [
    AppGateway,
  ],
})
export class AppModule {}
