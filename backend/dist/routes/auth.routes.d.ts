import express, { Request, Response, NextFunction } from "express";
declare const AuthRouter: import("express-serve-static-core").Router;
export declare const verifyToken: (roles?: string[]) => (req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined;
export default AuthRouter;
//# sourceMappingURL=auth.routes.d.ts.map