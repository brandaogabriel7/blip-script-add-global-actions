import { Builder } from 'selenium-webdriver';

const chromeDriver = new Builder().forBrowser('chrome').build();

export default chromeDriver;
