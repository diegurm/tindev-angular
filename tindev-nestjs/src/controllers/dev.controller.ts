import { Controller, Get, Req, Res, Body, Post, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('dev')
export class DevController {
  constructor(
    @InjectModel('Dev')
    private readonly Dev: Model<any>,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async index(@Req() req, @Res() res) {
    const { user } = req.headers;
    const loggedDev = await this.Dev.findById(user);
    const users = await this.Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    });

    return res.json(users);
  }

  @Post()
  async store(@Req() req, @Res() res, @Body() body: any) {
    const { username } = body;

    const userExists = await this.Dev.findOne({ user: username });
    if (userExists) {
      return res.json(userExists);
    }

    const response: any = await this.httpService.get(`https://api.github.com/users/${username}`);
    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await this.Dev.create({
      name,
      user: username,
      bio,
      avatar,
    });

    return res.json(dev);
  }
}
