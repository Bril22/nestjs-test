import { Injectable, NestMiddleware } from '@nestjs/common';
import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  // express
  // private readonly csrfProtection = csurf({ cookie: true });

  // use = (req: Request, res: Response, next: NextFunction) => {
  //   this.csrfProtection(req, res, next);
  // };

  // fastify
  private csrfProtection;
  constructor() {
    this.csrfProtection = csurf({ cookie: true });
    this.use = this.use.bind(this);
  }
  use(req: FastifyRequest, res: FastifyReply, next: NextFunction) {
    this.csrfProtection(req, res, next);
  }
}
