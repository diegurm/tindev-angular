import { Controller, Post, Param, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, Request } from 'express';

@Controller()
export class DislikeController {
  constructor(
    @InjectModel('Dev')
    private readonly devModel: Model<any>,
  ) {}

  @Post('/devs/:devId/dislikes')
  async store(@Req() req: Request, @Res() res: Response) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggedDev = await this.devModel.findById(user);
    const targetDev = await this.devModel.findById(devId);
    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' });
    }

    loggedDev.dislikes.push(targetDev._id);
    await loggedDev.save();

    return res.json(loggedDev);
  }
}
