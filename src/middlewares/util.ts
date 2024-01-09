import { NextFunction, Request, Response } from "express";

export function getAuthHeader(req: Request) {
  return req.headers.authorization;
}

export function getRequestIp(req: Request) {
  return req.ip || req.socket.remoteAddress;
}
