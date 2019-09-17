import { Request, Response } from 'express';
import { Controller, Get, Req, Res, Post, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('devs')
export class DevController {
  constructor(
    @InjectModel('Dev')
    private readonly devModel: Model<any>,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async index(@Req() req: Request, @Res() res: Response) {
    const { user } = req.headers;
    const loggedDev = await this.devModel.findById(user);
    const users = await this.devModel.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    });

    return res.json(users);
  }

  @Post()
  async store(@Req() req: Request, @Res() res: Response) {
    const { username } = req.body;

    const userExists = await this.devModel.findOne({ user: username });
    if (userExists) {
      return res.json(userExists);
    }

    const response: any = await this.httpService.get(
      `https://api.github.com/users/${username}`,
    );
    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await this.devModel.create({
      name,
      user: username,
      bio,
      avatar,
    });

    return res.json(dev);
  }
}
