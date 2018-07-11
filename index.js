var Assistant = require("actions-on-google").ApiAiApp;
var expressMockery = require("node-mocks-http");

exports.handler = function (event, context, callback) {

    // With the bespoken proxy the event is the payload. In your lambda it is very likely different!
    var assistant = getAssistant(event);

    var obj = {
        "conversationToken": "{\"state\":null,\"data\":{}}",
        "expectUserResponse": true,
        "expectedInputs": [
            {
                "inputPrompt": {
                    "noInputPrompts": [],
                    "richInitialPrompt": {
                        "items": [
                            {
                                "simpleResponse": {
                                    "textToSpeech": "You're now talking to GActions Integration",
                                    "displayText": "You're now talking to GActions Integration"
                                }
                            },
                            {
                                "basicCard": {
                                    "buttons": [
                                        {
                                            "title": "Some Reddit to chill",
                                            "openUrlAction": {
                                                "url": "https://www.reddit.com"
                                            }
                                        }
                                    ],
                                    "formattedText": "Here's some simp-wave to relax and chill out to",
                                    "image": {
                                        "url": "http://tracks.arte.tv/sites/default/files/styles/jscrop_1007x566/public/c_simpsons_2.jpg?itok=INzKpsvK",
                                        "accessibilityText": "A World of Simpsonwave"
                                    },
                                    "title": "A World of Simpsonwave",
                                    "imageDisplayOptions": "CROPPED"
                                }
                            }
                        ],
                        "suggestions": []
                    }
                },
                "possibleIntents": [
                    {
                        "intent": "actions.intent.TEXT"
                    }
                ]
            }
        ],
        "resetUserStorage": false,
        "userStorage": "{}",
        "finalResponse": null,
        "isInSandbox": true,
        "customPushMessage": null
    };

    // Do your thing ...
    assistant.tell("Rede mit mir ...");

    var response = JSON.stringify(assistant.response_._getData());

    var json = JSON.stringify(obj);

    //callback(null, json);
    callback(null, response);
};

function getAssistant(requestBody) {

    // Prep the request and response.
    var mockRequest = expressMockery.createRequest({
        body: requestBody
    });

    var mockResponse = expressMockery.createResponse();

    // We need this monkey patch because node-mocks-http doesn't have the append.
    mockResponse["append"] = (header, value) => {
        console.log("Google SDK added a header: \"" + header + "\": \"" + value + "\"");
    };

    /*
    "{\"speech\":\"DEBUG00\",\"contextOut\":[],\"data\"
    :{\"google\":{\"expect_user_response\":false,\"no_input_prompts\":[],\"is_ssml\":false}}}"
    */

    // Feed the request/response to the assistant SDK
    return new Assistant({ request: mockRequest, response: mockResponse });
}