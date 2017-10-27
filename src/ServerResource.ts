import {ClientError} from "./ClientError";
import {Context} from "./Context";
import {SmokeScreenServer} from "./SmokeScreenServer";

const HTTP_METHOD_ERROR = new ClientError(405, "HTTP method not supported");

export abstract class ServerResource {

    private _server: SmokeScreenServer;

    constructor(private readonly path: string) {}

    handleGet(_context: Context) {
        throw HTTP_METHOD_ERROR;
    }

    handlePost(_context: Context) {
        throw HTTP_METHOD_ERROR;
    }

    handlePut(_context: Context) {
        throw HTTP_METHOD_ERROR;
    }

    handleDelete(_context: Context) {
        throw HTTP_METHOD_ERROR;
    }

    register(server: SmokeScreenServer) {
        this._server = server;
        server.app.get(this.path, this.wrap(this.handleGet));
        server.app.post(this.path, this.wrap(this.handlePost));
        server.app.put(this.path, this.wrap(this.handlePut));
        server.app.delete(this.path, this.wrap(this.handleDelete));
    }

    private wrap(handler: (context: Context) => any) {
        return (req: Express.Request, res: Express.Response) => {
            try {
                const context = new Context(this._server.smokeScreen, req, res);
                const result = handler(context);
                const _this = this;
                Promise.resolve(result)
                    .then(responseEntity => (res as any).json(responseEntity))
                    .catch(e => _this._server.errorHandler(e, req, res));
            } catch (e) {
                this._server.errorHandler(e, req, res);
            }
        };
    }

}
