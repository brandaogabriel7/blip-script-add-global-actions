import { By, until, Key } from 'selenium-webdriver';

const loginToBlipPortal = async (driver, { username, password }) => {
  await driver.get(
    'https://account.blip.ai/login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dblip-portal%26redirect_uri%3Dhttps%253A%252F%252Fportal.blip.ai%252Fauthorize%26response_type%3Did_token%2520token%26scope%3Doffline_access%2520openid%2520profile%2520email%2520api-msging-hub.full_access%26state%3Dfe3e8195269b4e84bb3e5e428fc48ab2%26nonce%3Da9a76f021a4c490fb43189d27a6a8e7b'
  );

  const usernameField = await driver.wait(
    until.elementLocated(By.name('Username')),
    10000
  );
  const passwordField = await driver.wait(
    until.elementLocated(By.name('Password')),
    10000
  );

  await usernameField.sendKeys(username);
  await passwordField.sendKeys(password, Key.ENTER);
};

const getAuthorizationKeyForBot = async (driver, identifier) => {
  await driver.get(
    `https://take.blip.ai/application/detail/${identifier}/configurations/apikey`
  );
  const authorizationKeyReadonlyField = await driver.wait(
    until.elementLocated(
      By.css(
        '#main-content-area > div > div > card.card-dashed.bp-bg-transparent.ph5.pv4 > div > div > div.card-content > div > div:nth-child(1) > div:nth-child(1) > input-clipboard > div > input'
      )
    ),
    10000
  );
  let authorizationKeyValue = await authorizationKeyReadonlyField.getAttribute(
    'value'
  );
  while (authorizationKeyValue === '') {
    authorizationKeyValue = await authorizationKeyReadonlyField.getAttribute(
      'value'
    );
  }
  return authorizationKeyValue;
};

const publishBot = async (driver, botIdentifier) => {
  await driver.get(
    `https://take.blip.ai/application/detail/${botIdentifier}/templates/builder/`
  );

  const publishBotButton = await driver.wait(
    until.elementLocated(
      By.css(
        '#main-content-area > div > div > div.row.mt0.w-100 > ul > li:nth-child(2) > tooltip-button > div > button'
      )
    ),
    20000
  );

  await publishBotButton.click();

  try {
    await driver.wait(
      until.elementLocated(
        By.css(
          'body > div.wrapper > div.ng-toast.ng-toast--left.ng-toast--bottom.ng-toast--animate-slide > ul > li'
        )
      ),
      10000
    );
  } catch (err) {
    console.error(err, `Couldn't publish bot ${botIdentifier}`);
  }
};

export { loginToBlipPortal, getAuthorizationKeyForBot, publishBot };
