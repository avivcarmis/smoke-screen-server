import {SmokeScreen} from "smoke-screen";
import * as express from "express";
import {Request, Response} from "express";
import {ServerResource} from "./ServerResource";
import {ClientError} from "./ClientError";
import {Context} from "./Context";

export type ErrorDispatcher = (smokeScreen: SmokeScreen, e: any,
                               req: Request, res: Response) => void;

export type SuccessDispatcher = (smokeScreen: SmokeScreen, body: any,
                                 req: Request, res: Response) => void;

export interface ServerSettings {

    smokeScreen?: SmokeScreen;

    errorDispatcher?: ErrorDispatcher;

    successDispatcher?: SuccessDispatcher;

}

const DEFAULT_SETTINGS: ServerSettings = {

    smokeScreen: new SmokeScreen(),

    errorDispatcher: (e, _req, res) => {
        if (e instanceof ClientError) {
            (res as any).status(e.statusCode);
            (res as any).send(e.message);
        } else {
            (res as any).status(500);
            (res as any).send("internal server error");
        }
    },

    successDispatcher: (responseEntity, _req, res) => {
        (res as any).json(responseEntity);
    }

};

export class SmokeScreenServer {

    readonly app: express.Express;

    readonly smokeScreen: SmokeScreen;

    readonly errorDispatcher: ErrorDispatcher;

    readonly successDispatcher: SuccessDispatcher;

    constructor(settings: ServerSettings = {}) {
        this.app = express();
        settings = Object.assign({}, DEFAULT_SETTINGS, settings);
        this.smokeScreen = settings.smokeScreen!;
        this.errorDispatcher = settings.errorDispatcher!;
        this.successDispatcher = settings.successDispatcher!;
    }

    addResources(...resources: ServerResource[]) {
        for (const resource of resources) {
            this.app.get(resource.path, this.wrap(resource.handleGet));
            this.app.post(resource.path, this.wrap(resource.handlePost));
            this.app.put(resource.path, this.wrap(resource.handlePut));
            this.app.delete(resource.path, this.wrap(resource.handleDelete));
        }
        return this;
    }

    listen(port: number, callback?: any) {
        this.app.listen(port, callback);
    }

    private wrap(handler: (context: Context) => any) {
        const _this = this;
        return (req: Request, res: Response) => {
            try {
                const context = new Context(_this.smokeScreen, req, res);
                const result = handler(context);
                Promise.resolve(result)
                    .then(resEntity =>
                        _this.successDispatcher(_this.smokeScreen, resEntity, req, res))
                    .catch(e =>
                        _this.errorDispatcher(_this.smokeScreen, e, req, res));
            } catch (e) {
                _this.errorDispatcher(_this.smokeScreen, e, req, res);
            }
        };
    }

}
