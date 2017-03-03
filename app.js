require('dotenv').load();

var tidy = require('htmltidy').tidy; // to format html response
var html_finder = require('./string').html_finder; // parses response to separate html
var text_finder = require('./string').text_finder; // parses response to separate text response
var Botkit = require('botkit');
var express = require('express');
var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  version_date: '2016-09-20'
});

// Configure bot
var slackController = Botkit.slackbot();
var slackBot = slackController.spawn({
  token: process.env.SLACK_TOKEN
});
slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  slackController.log('Slack message received');
  middleware.interpret(bot, message, function(err) {
    var html_response = html_finder(message.watsonData.output.text.join('\n'));
    var text_response = text_finder(message.watsonData.output.text.join('\n'));
    if (html_response != '') { // If HTML is detected
      tidy(html_response, function(err, html) {
        bot.reply(message, html);
        bot.reply(message, text_response);
      })
    } else {
      bot.reply(message, text_response);
    }
	});
});

slackBot.startRTM();

// Express app
var app = express();
var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});
