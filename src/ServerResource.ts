import {ClientError} from "./ClientError";
import {Context} from "./Context";

const HTTP_METHOD_ERROR = new ClientError(405, "HTTP method not supported");

export abstract class ServerResource {

    constructor(readonly path: string) {}

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

}
