/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { DefaultApiClient, HandlerInput, RequestHandler, SkillBuilders } from 'ask-sdk';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { Response } from 'ask-sdk-model';

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }

    public async handle(handlerInput : HandlerInput) : Promise<Response> {
        const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient();
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

        try {
            const timeZone = await upsServiceClient.getSystemTimeZone(deviceId);
            const speechText = `Your timeZone is ${timeZone}`;
            return handlerInput.responseBuilder.speak(speechText).getResponse();
        } catch (e) {
            console.log('error', e)
            return handlerInput.responseBuilder.speak('I am not allowed to view your timeZone.').getResponse();
        }
    }

}

export const handler : LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
    )
    .withApiClient(new DefaultApiClient())
    .lambda();
