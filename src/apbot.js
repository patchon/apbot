//
// Simple bot for discord to create GitHub issues,
//

const discord = require('discord.js');
const octokit = require('@octokit/rest');
const tmpl    = require('./constants.js');

(function(){

  // Make sure to have proper logging available, not scoped to anything
  debug = {
    on: process.env.APBOT_DEBUG,
    dbg: "DBG",
    inf: "INF",
    wrn: "WRN",
    err: "ERR",
  }

  // Everything is from env's,,
  const config = {
    dc: {
      token: process.env.DC_TOKEN,
      channel: process.env.DC_CHANNEL,
    },
    gh: {
      token: process.env.GH_TOKEN,
      username: process.env.GH_USERNAME,
      repo: process.env.GH_REPO,
      repo_owner: process.env.GH_REPO_OWNER
    }
  }

  // Make sure we have needed vars,
  logger(debug.inf, tmpl.cli_inf_start);
  preflight(config);

  // Create clients,
  const clients = {
    dc: {
      client: new discord.Client()
    },
    gh: {
      client: new octokit({ auth: config.gh.token })
    }
  }

  // Setup listeners,
  setup_rdy_listener(clients.dc.client, config.dc.channel);
  setup_msg_listener(clients, config);

  // Login to discord,
  login(clients.dc.client, config.dc.token);
}());


// Function for logging in to discord,
function login(client, token){

  client.login(token).then(function(){
    logger(debug.inf, tmpl.cli_inf_auth_success);
  }).catch(function(err){
    logger(debug.err, err);
  });
}


// Function for setting up the ready listener
function setup_rdy_listener(client, announce_channel){

  // Bind ready event,
  client.once('ready', () => {
    logger(debug.inf, tmpl.cli_inf_ready);

    const channel = client.channels.find(ch => ch.name === announce_channel);
    const botname = client.user.username;

    if (!channel){
      logger(debug.err, tmpl.cli_err_channel_not_found
                         .replace('{PH_ANNOUNCE_CHANNEL}', announce_channel));
    }

    if (!botname){
      logger(debug.err, tmpl.cli_err_unexpected_api_response);
    }

    logger(debug.dbg, tmpl.cli_dbg_channel_botname
                        .replace('{PH_CHANNEL}', announce_channel)
                        .replace('{PH_BOTNAME}', botname));

    channel.send(tmpl.cli_inf_welcome_msg
                  .replace('{PH_BOTNAME}', botname));
  });
}


// Function for setting up the message listerner,
function setup_msg_listener(clients, config){

  // Bind message events,
  clients.dc.client.on('message', msg => {
    const prefix = "!";

    // Make sure to ignore regular messages and me self,
    if (!msg.content.startsWith(prefix) || msg.author.bot){
      return;
    }

    // Parse message and arguments
    const cmd  = parse_cmd(msg);
    const args = parse_args(msg);

    // Simple switch to do whatever we are asked to,
    switch(cmd) {
      case "help":
        bot_cmd_help(msg);
        break;

      case "issue":
        bot_cmd_issue(clients.gh.client, config.gh, msg, args, cmd);
        break;

      default:
        msg.channel.send(tmpl.bot_cmd_err
                          .replace('{PH_CMD}', cmd));
    }
  });
}


// Bot-function for the !help command,
function bot_cmd_help(msg){

  const embed = tmpl.bot_cmd_help

  tmpl.bot_cmd_help.title = tmpl.bot_cmd_help.title
                             .replace('{PH_USER}', msg.author.username);

  msg.channel.send({embed});
}


// Bot-function for the !issue command,
function bot_cmd_issue(client, config, msg, args, cmd){

  const num_args = 2;

  if (args.length < num_args){
    msg.channel.send(tmpl.bot_cmd_issue_arg_err
                      .replace('{PH_CMD}', cmd)
                      .replace('{PH_NUM}', num_args)
                      .replace('{PH_NUM_GIVEN}', args.length)
    );

    return
  }

  const title    = args[0];
  const username = msg.author.username;
  const channel  = msg.channel.name;
  let desc = args[1];
      desc += tmpl.bot_cmd_issue_footer
               .replace('{PH_USERNAME}', username)
               .replace('{PH_CHN}', channel)

  const embed  = JSON.parse(JSON.stringify(tmpl.bot_cmd_issue_creating));
  let   labels = [];

  // Split labels,
  if (args[2]){
    labels = args[2].split(",");
    labels = labels.map(str => str.trim());
    embed.fields[1].value = args[2];
  }else{
    embed.fields.pop();
  }

  embed.title = embed.title
                 .replace('{PH_USER}', msg.author.username);

  embed.fields[0].name  = embed.fields[0].name
                           .replace('{PH_TITLE}', title);
  embed.fields[0].value = embed.fields[0].value
                           .replace('{PH_DESC}', desc);

  // Let the user know that we are on roll,
  msg.channel.send({embed});

  // Create the actual github issue,
  client.issues.create({
    owner: config.repo_owner,
    repo: config.repo,
    title: title,
    body: desc,
    labels: labels
  }).then(function(resp){
    logger(debug.dbg, tmpl.bot_cmd_issue_success);
    msg.channel.send(tmpl.bot_cmd_issue_success);
  }).catch(function(err){
    logger(debug.wrn, err);
    msg.channel.send(tmpl.bot_cmd_issue_creating_err
                      .replace('{PH_ERR}', err));
  })
}


// Function to make sure we have what we need,
function preflight(config){

  let err = false;

  // Make sure everything is set before continuing,
  logger(debug.dbg, tmpl.cli_dbg_env_chk)
  for (var app in config) {
    for (var env in config[app]){

      if(config[app][env]){
        logger(debug.dbg, tmpl.cli_dbg_env_msg
                       .replace('{PH_ENV}', app.concat('_', env).toUpperCase())
                       .replace('{PH_VAL}', config[app][env]));
      }else{
        err = true;
        logger(debug.wrn, tmpl.cli_err_env_msg
                      .replace('{PH_ENV}', app.concat('_', env).toUpperCase()));
      }
    }
  }

  // Exit if we are missing needed variables,
  if (err){
    logger(debug.err, tmpl.cli_dbg_env_fail)
  }
}


// Function to parse args, returns a list of arguments
function parse_args(msg){

  logger(debug.dbg, tmpl.cli_dbg_parse_arg_try
                     .replace('{PH_STR}', msg.content));

  // Construct array based on ", remove first element, as well as empty ones,
  let args = msg.content.split("\"");
  if (args[0] === msg.content){
    logger(debug.dbg, tmpl.cli_dbg_parse_arg_retry);
    args = msg.content.split(" ");
  }else{
    args = args.filter(str => str.trim() != '');
  }

  // Remove command,
  args.shift();

  if (args.length === 0){
    logger(debug.dbg, tmpl.cli_dbg_parse_arg_none)
  }else{
    logger(debug.dbg, tmpl.cli_dbg_parse_arg_res
      .replace('{PH_ARGS}', args));
  }

  return args;
}


// Function to parse the actual command given, returns the command
function parse_cmd(msg){

  logger(debug.dbg, tmpl.cli_dbg_parse_cmd_try
                     .replace('{PH_STR}', msg.content));

  const str = msg.content
  let cmd = str.substr(1,str.indexOf(' ')).trim();

  // If we can't extract substring based on " ", we simply dont have any args
  if (!cmd){
    cmd = str.substr(1);
  }

  logger(debug.dbg, tmpl.cli_dbg_parse_cmd_res
                     .replace('{PH_CMD}', cmd));
  return cmd;
}


// Function for logging,
function logger(level,str){

  const date_str = new Date().toISOString().slice(0,19).replace('T',' ');

  // Do not debug unless asked,
  if (debug.level === 'DBG' && debug.ON){
    return;
  }

  console.log(date_str+" [ "+level+" ] "+str);

  // Always exit on error,
  if (level === 'ERR'){
    process.exit(1);
  }
}
