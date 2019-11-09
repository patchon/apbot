
//
// Templating constants,
//


// Bot messages,
const bot_cmd_err = `
\`\`\`diff
- [ ERR ] Command '{PH_CMD}' was not understood, try !help.
\`\`\`
`;

const bot_cmd_help = {
  "title": "Here\'s a help page for you **{PH_USER}**",
  "description": "Below follows a list of commands I understand. Please "+
                 "help me develop and learn new things through "         +
                 "[GitHub](https://github.com/patchon/apbot).",
  "color": 15242396,
  "fields": [
    {
      "name": "`!help`",
      "value": "This help text - **no more no less**."
    },
    {
      "name": "`!issue`",
      "value": "Create an GitHub issue. Command takes three arguments, "       +
               "`\"title\"` `\"description\"` and `\"labels\"`, in that order,"+
               "where labels are optional."
    }
  ]
};

const bot_cmd_issue_arg_err = `
\`\`\`diff
- Command !{PH_CMD} needs {PH_NUM} arguments (+1 optional), I got`+
` {PH_NUM_GIVEN}. Note that each argument should be embedded in "quotes".
\`\`\`
`;

const bot_cmd_issue_creating = {
  "title": "Creating an GitHub issue for you **{PH_USER}**",
  "color": 15242396,
  "fields": [
    {
      "name": "{PH_TITLE}",
      "value": "{PH_DESC}"
    },
    {
      "name": "Label(s)",
      "value": "{PH_LABELS}"
    }
  ]
};

const bot_cmd_issue_footer = `

---
Beep, boop, I'm [a bot](https://github.com/patchon/apbot).
This issue was created by **{PH_USERNAME}** from the channel **#{PH_CHN}**.`;

const bot_cmd_issue_creating_err = `
\`\`\`diff
- GitHub returned an error,

{PH_ERR}
\`\`\`
`;

const bot_cmd_issue_success   = "Successfully created the GitHub issue 👌";

// Debug messages
const cli_dbg_channel_botname = "Found channel '#{PH_CHANNEL}' and my name is "+
                                "'{PH_BOTNAME}'."
const cli_dbg_env_msg         = "Environment variable '{PH_ENV}' is set to '{PH_VAL}'."
const cli_dbg_env_chk         = "Checking needed environment variables."
const cli_dbg_env_fail        = "Preflight tests did not succeed, aborting."

const cli_dbg_parse_arg_none  = "No arguments could be parsed."
const cli_dbg_parse_arg_retry = "Splitted string on \", yields zero results, "   +
                                "trying on space instead - may lead to unwanted "+
                                "behaviour.";
const cli_dbg_parse_arg_res   = "Parsed following arguments '{PH_ARGS}'."
const cli_dbg_parse_arg_try   = "Parsing arguments from string '{PH_STR}'."

const cli_dbg_parse_cmd_res   = "Parsed the following command '{PH_CMD}'."
const cli_dbg_parse_cmd_try   = "Parsing command from string '{PH_STR}'."


// Ifno messages,
const cli_inf_auth_success = 'Successfully authenticated to Discord.'
const cli_inf_exit_msg     = "Oh noes, I'm going offline. See you soon!";
const cli_inf_ready        = "Bot recieved ready event from Discord server";
const cli_inf_start        = "Starting bot.";
const cli_inf_welcome_msg  = "Hello, my name is **{PH_BOTNAME}** and I just "    +
                             "came online. Please type `!help` for instructions "+
                             "on how to use me.";

// Error messages,
const cli_err_channel_not_found       = "Could not find channel specified in "  +
                                        "environment variable 'DISCORD_CHANNEL'"+
                                        "({PH_ANNOUNCE_CHANNEL})."
const cli_err_env_msg                 = "Environment variable '{PH_ENV}' not set."
const cli_err_unexpected_api_response = "Unexpected response from Dicord API.";


module.exports = {

  bot_cmd_err,
  bot_cmd_help,

  bot_cmd_issue_arg_err,
  bot_cmd_issue_creating,
  bot_cmd_issue_footer,
  bot_cmd_issue_creating_err,
  bot_cmd_issue_success,

  cli_dbg_channel_botname,
  cli_dbg_env_msg,
  cli_dbg_env_chk,
  cli_dbg_env_fail,

  cli_dbg_parse_arg_none,
  cli_dbg_parse_arg_retry,
  cli_dbg_parse_arg_res,
  cli_dbg_parse_arg_try,

  cli_dbg_parse_cmd_res,
  cli_dbg_parse_cmd_try,

  cli_err_channel_not_found,
  cli_err_env_msg,
  cli_err_unexpected_api_response,

  cli_inf_auth_success,
  cli_inf_exit_msg,
  cli_inf_ready,
  cli_inf_start,
  cli_inf_welcome_msg,
}
