import { setGlobalActions, getRouterSubbots } from './blipCommands.js';
import GLOBAL_ACTIONS from './globalActions.js';

import driver from './chromeDriver.js';

import settings from './settings.json';
import {
  getAuthorizationKeyForBot,
  loginToBlipPortal,
  publishBot
} from './portalService.js';

const subbots = await getRouterSubbots(settings.router);

await loginToBlipPortal(driver, settings);

const subbotsSettings = [];

for (let botIdentifier of subbots) {
  try {
    const authorizationKey = await getAuthorizationKeyForBot(
      driver,
      botIdentifier
    );
    subbotsSettings.push({
      botIdentifier,
      authorizationKey
    });
  } catch {
    console.warn(`you don't have access to ${botIdentifier}`);
  }
}

console.log(subbotsSettings);

const setGlobalActionsPromises = subbotsSettings.map(
  (bot) =>
    new Promise(async (resolve) => {
      const response = await setGlobalActions(
        GLOBAL_ACTIONS,
        bot.authorizationKey
      );
      console.log(
        `\n\nSet ${bot.botIdentifier} global actions response :`,
        response.data
      );
      resolve();
    })
);

await Promise.all(setGlobalActionsPromises);

if (settings.shouldPublish) {
  for (let bot of subbotsSettings) {
    try {
      await publishBot(driver, bot.botIdentifier);
      console.log(`published ${bot.botIdentifier} bot`);
    } catch (err) {
      console.error(err, `couldn't publish ${bot.botIdentifier} bot`);
    }
  }
}

await driver.quit();
