import { Controller, Res, Post, Req, Headers } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, Request } from 'express';
import { AppGateway } from '../app.gateway';

@Controller()
export class LikeController {
  constructor(
    @InjectModel('Dev')
    private readonly devModel: Model<any>,
    private readonly appGateway: AppGateway,
  ) {}

  @Post('devs/:devId/likes')
  async store(@Req() req: Request, @Headers() headers, @Res() res: Response) {
    const { devId } = req.params;
    const { user } = headers;

    const loggedDev = await this.devModel.findById(user);
    const targetDev = await this.devModel.findById(devId);
    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggetSocket = this.appGateway.connectedUsers[user];
      const targetSocket = this.appGateway.connectedUsers[devId];

      if (loggetSocket) {
        this.appGateway.eventMatch(loggetSocket, targetDev);
      }

      if (targetSocket) {
        this.appGateway.eventMatch(targetSocket, loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);
    await loggedDev.save();

    return res.json(loggedDev);
  }
}
