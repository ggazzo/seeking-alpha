import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ApiSecurity,
    ApiVisibility,
} from "@rocket.chat/apps-engine/definition/api";
import { App } from "@rocket.chat/apps-engine/definition/App";
import {
    IEmailDescriptor,
    IPreEmailSentContext,
} from "@rocket.chat/apps-engine/definition/email";
import { IPreEmailSent } from "@rocket.chat/apps-engine/definition/email/IPreEmailSent";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { GetUserUnreadMessageCountEndpoint } from "./endpoints/getUserUnreadMessageCount";

export class SeekingAlphaApp extends App implements IPreEmailSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePreEmailSent(
        context: IPreEmailSentContext,
        _read: IRead,
        _http: IHttp,
        _persis: IPersistence,
        _modify: IModify
    ): Promise<IEmailDescriptor> {
        const { email } = context;

        return {
            ...email,
            headers: {
                ...(email.headers || {}),
                "X-SA-send-ts": String(Math.round(new Date().getTime() / 1000)),
            },
        };
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        // Register API endpoints
        configuration.api.provideApi({
            visibility: ApiVisibility.PRIVATE,
            endpoints: [new GetUserUnreadMessageCountEndpoint(this)],
            security: ApiSecurity.UNSECURE,
        });
    }
}
