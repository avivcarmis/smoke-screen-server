import {Constructable} from "../dist/src/Constructable";
import {SmokeScreen} from "smoke-screen";
import {ClientError} from "./ClientError";

export class Context {

    constructor(private readonly smokeScreen: SmokeScreen,
                readonly req: Express.Request,
                readonly res: Express.Response) {}

    bodyAs<T>(type: Constructable<T>): T {
        try {
            return this.smokeScreen.fromObject((this.req as any).body, type);
        } catch (e) {
            throw new ClientError(400, e.message);
        }
    }

    queryStringAs<T>(type: Constructable<T>): T {
        try {
            return this.smokeScreen.fromObject((this.req as any).query, type);
        } catch (e) {
            throw new ClientError(400, e.message);
        }
    }

    routeParamsAs<T>(type: Constructable<T>): T {
        try {
            return this.smokeScreen.fromObject((this.req as any).params, type);
        } catch (e) {
            throw new ClientError(400, e.message);
        }
    }

    headersAs<T>(type: Constructable<T>): T {
        try {
            return this.smokeScreen.fromObject((this.req as any).headers, type);
        } catch (e) {
            throw new ClientError(400, e.message);
        }
    }

}
