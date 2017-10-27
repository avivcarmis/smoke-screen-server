import * as util from "util";

export class ClientError extends Error {

    constructor(readonly statusCode: number, format: string, ...messageParams: any[]) {
        super(util.format(format, messageParams));
    }

}
