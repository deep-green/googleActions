var Assistant = require("actions-on-google").ApiAiApp;
var expressMockery = require("node-mocks-http");

const app = Assistant({ debug: true });

app.intent("actions.intent.MAIN", (conv) => {
    conv.ask("Debug21");
});

exports.handler = function (event, context, callback) {

    // With the bespoken proxy the event is the payload. In your lambda it is very likely different!
    var assistant = getAssistant(event);

    // Do your thing ...
    assistant.tell("Hiii");

    var response = JSON.stringify(assistant.response_._getData());

    /*
    var response2 = assistant.response_._getData();
    var response3 = "sup?";

    var message =
    {
        "speech": "Text response",
        "type": 0
    };
    */

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

exports.myFunction = functions.https.onRequest(app);