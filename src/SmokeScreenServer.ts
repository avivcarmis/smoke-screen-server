import {SmokeScreen} from "smoke-screen";
import * as express from "express";
import {ServerResource} from "./ServerResource";
import {ClientError} from "./ClientError";

export class SmokeScreenServer {

    readonly app: express.Express;

    readonly smokeScreen: SmokeScreen;

    readonly errorHandler: (e: any, req: Express.Request, res: Express.Response) => void;

    constructor(...resources: ServerResource[]) {
        this.app = express();
        this.smokeScreen = new SmokeScreen();
        this.errorHandler = (e, _req, res) => {
            if (e instanceof ClientError) {
                (res as any).status(e.statusCode);
                (res as any).send(e.message);
            } else {
                (res as any).status(500);
                (res as any).send("internal server error");
            }
        };
        for (const resource of resources) {
            resource.register(this);
        }
    }

}
