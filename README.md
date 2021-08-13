# Blip addGlobalActions script

This script helps you add the same global actions to all the bots in a router
more easily. It uses Selenium for stuff that need user's authentication and
commands for stuff that need bot's authentication.

It's really simple to use, you just need to:

1. Fill in the settings.json file with the user credentials (username and
   password) and the router's keys (identifier and authorization key).

1. Update the GLOBAL_ACTIONS object, in `globalActions.js` file, with the global
   actions that will be added to all bots.

1. Install the packages with `yarn` command.

1. Run the script with `yarn start` command.
