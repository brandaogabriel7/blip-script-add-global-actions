import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TAKE_BLIP_CLIENT_BASE_COMMANDS_URL =
  'https://take.http.msging.net/commands';

const setGlobalActions = async (globalActions, botAuthorization) => {
  const command = {
    id: uuidv4(),
    method: 'set',
    type: 'application/json',
    uri: '/buckets/blip_portal%3Abuilder_working_global_actions',
    resource: globalActions
  };
  return await axios.post(TAKE_BLIP_CLIENT_BASE_COMMANDS_URL, command, {
    headers: { Authorization: botAuthorization }
  });
};

const getRouterSubbots = async ({ identifier, authorization }) => {
  const command = {
    id: uuidv4(),
    method: 'get',
    uri: `lime://${identifier}@msging.net/configuration/caller`
  };
  const response = await axios.post(
    TAKE_BLIP_CLIENT_BASE_COMMANDS_URL,
    command,
    {
      headers: { Authorization: authorization }
    }
  );
  const applicationSetting = response.data.resource.items.filter(
    (setting) =>
      setting.owner === 'enterprise.master.hosting@msging.net' &&
      setting.caller === `${identifier}@msging.net` &&
      setting.name === 'Application'
  )[0].value;
  return JSON.parse(applicationSetting).settings.children.map(
    (bot) => bot.shortName
  );
};

export { setGlobalActions, getRouterSubbots };
