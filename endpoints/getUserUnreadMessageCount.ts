import {
    HttpStatusCode,
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";

export class GetUserUnreadMessageCountEndpoint extends ApiEndpoint {
    public path = "user/:uid/getUserUnreadMessageCount";

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const { uid } = request.params;
        // const content = Object.entries(request.content).map(
        //     ([key, value]) => `${key}: ${value}`
        // );
        // const params = Object.entries(request.params).map(
        //     ([key, value]) => `${key}: ${value}`
        // );

        if (!uid) {
            throw new Error("uid is required");
        }

        // Provide mechanism to prevent unauthenticated users from accessing the endpoint
        // request.headers.authorization......

        const count = await read.getUserReader().getUserUnreadMessageCount(uid);

        return this.success(JSON.stringify({ count }));
    }
}
