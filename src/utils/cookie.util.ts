import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
  });
};
