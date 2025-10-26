import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    user?: {
        uid: string;
        role: string;
    };
}
export declare const verifyToken: (roles?: string[]) => (req: CustomRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map