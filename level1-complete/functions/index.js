// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('cor favorita', (conv, {color}) => {
    const luckyNumber = color.length;
    const audioFile = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'
    // Respond with the user's lucky number and end the conversation.
    // conv.close('Seu número da sorte é ' + luckyNumber);
    conv.ask(`
    <speak>
    Seu número da sorte é ${luckyNumber}.
    <audio src="${audioFile}"></audio>
    Quer conhecer mais cores legais?
    </speak>
    `);
    conv.ask(new Suggestions('Sim', 'Não'));
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        conv.ask(`OK, sem problemas. Qual sua cor favorita?`);
        // conv.ask(new Suggestions('Azul', 'Vermelho', 'Verde'));
    } else {
        conv.data.userName = conv.user.name.display;
        conv.ask(`Obrigada ${conv.data.userName}. Qual sua cor favorita?`);
        conv.ask(new Suggestions('Azul', 'Vermelho', 'Verde'));
    }
    
});

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Permission({
        context: 'Oi, quero te conhecer melhor',
        permissions: ['NAME'],
    }));
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
