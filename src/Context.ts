import {Constructable} from "../dist/src/Constructable";
import {SmokeScreen} from "smoke-screen";

export class Context {

    constructor(private readonly smokeScreen: SmokeScreen,
                readonly req: Express.Request,
                readonly res: Express.Response) {}

    bodyAs<T>(type: Constructable<T>): T {
        return this.smokeScreen.fromObject((this.req as any).body, type);
    }

    queryStringAs<T>(type: Constructable<T>): T {
        return this.smokeScreen.fromObject((this.req as any).query, type);
    }

    routeParamsAs<T>(type: Constructable<T>): T {
        return this.smokeScreen.fromObject((this.req as any).params, type);
    }

    headersAs<T>(type: Constructable<T>): T {
        return this.smokeScreen.fromObject((this.req as any).headers, type);
    }

}
