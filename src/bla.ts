import {ServerResource} from "./ServerResource";
import {Context} from "./Context";
import {exposed, SmokeScreen} from "smoke-screen";
import {SmokeScreenServer} from "./SmokeScreenServer";
import {Response} from "express";
import {ClientError} from "./ClientError";

class Resource extends ServerResource {

    constructor() {
        super("/bla");
    }

    handleGet(_context: Context): Promise<ResourceResponse> {
        const response = new ResourceResponse();
        response.prop1 = "blaaa";
        response.prop2 = true;
        return new Promise(res => {
            setTimeout(() => res(response));
        });
    }

}

class ResourceResponse {

    @exposed
    prop1: string;

    @exposed
    prop2: boolean;

}

class ServerResponse {

    @exposed
    result: any;

    @exposed
    error: any;

}

function respond(result: any, error: any, smokeScreen: SmokeScreen, res: Response) {
    const responseEntity = new ServerResponse();
    responseEntity.result = result;
    responseEntity.error = error;
    res.json(smokeScreen.toObject(responseEntity));
}

const server = new SmokeScreenServer({
    successDispatcher: (smokeScreen, body, _req, res) => {
        respond(body, null, smokeScreen, res);
    },
    errorDispatcher: (smokeScreen, e, _req, res) => {
        if (e instanceof ClientError) {
            (res as any).status(e.statusCode);
            respond(null, e.message, smokeScreen, res);
        } else {
            (res as any).status(500);
            respond(null, "internal server error", smokeScreen, res);
        }
    }
});
server.addResources(new Resource());
server.listen(3000, () => console.log("listen"));
