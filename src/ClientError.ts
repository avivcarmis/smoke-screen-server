import * as util from "util";

export class ClientError extends Error {

    constructor(readonly statusCode: number, message: string, ...messageParams: any[]) {
        super(util.format.apply(null, [message, ...messageParams]));
    }

}
