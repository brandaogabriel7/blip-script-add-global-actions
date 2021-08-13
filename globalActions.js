const GLOBAL_ACTIONS = {
  $contentActions: [],
  $conditionOutputs: [],
  $enteringCustomActions: [
    {
      $id: 'af191b5e-1f7a-404b-8949-17b708866448',
      type: 'SetVariable',
      $title: 'Set flOrigem',
      $invalid: false,
      settings: {
        variable: 'flOrigem',
        value: '{{state.id}}'
      },
      conditions: []
    },
    {
      $id: '9511ecaf-f89a-4504-9b52-7d8e430d6612',
      type: 'ExecuteScript',
      $title: 'get contact updated with hubspot integration variables',
      $invalid: false,
      settings: {
        function: 'run',
        source:
          'function run(contact) {\n    try {\n        contact = JSON.parse(contact);\n\n        extractHubspotIntegrationVariablesFromContactExtras(contact.extras);\n\n        return contact;\n    }\n    catch (err) {\n        return { isError: true, error: err};\n    }\n}\n\n// Currently, the variables from the hubspot integration can\'t be named, they come with the numbers from 1 to 5 as keys.\n// In order to know which variable is which, we send them in a key value pair format and split them here.\n//\n// So this:\n// {\n//     "1": "key=value"\n// }\n// becomes this:\n// {\n//     "1": "key=value",\n//     "key": "value"\n// } \nfunction extractHubspotIntegrationVariablesFromContactExtras(contactExtras) {    \n    for (let key in contactExtras) {\n        const extra = contactExtras[key];\n        if (extra) {\n            const entry = extra.split(\'=\');\n\n            if (entry.length > 1) {\n                contactExtras[entry[0]] = entry[1];\n            }\n        }\n    }\n}',
        inputVariables: ['contact.serialized'],
        outputVariable: 'updatedContact'
      },
      conditions: []
    },
    {
      $id: 'f8c23067-a323-4d3f-929e-216116685185',
      type: 'ProcessHttp',
      $title: 'update contact',
      $invalid: false,
      settings: {
        headers: {
          Authorization: '{{resource.authorizationApiTakeBlip}}'
        },
        method: 'POST',
        body: '{\r\n    "id": "{{random.guid}}",\r\n    "method": "set",\r\n    "uri": "/contacts",\r\n    "type": "application/vnd.lime.contact+json",\r\n    "resource": {{updatedContact}}\r\n}',
        uri: 'https://take.http.msging.net/commands',
        responseStatusVariable: 'statusUpdateContact',
        responseBodyVariable: 'responseUpdateContact'
      },
      conditions: [
        {
          $$hashKey: 'object:6318',
          source: 'context',
          comparison: 'notEquals',
          variable: 'updatedContact@isError',
          values: ['true']
        }
      ]
    },
    {
      $id: '83aed782-e588-4c69-9f54-f2e8672aa1c0',
      $typeOfContent: '',
      type: 'MergeContact',
      $title: 'update tagging',
      $invalid: false,
      settings: {
        extras: {
          tagging: '{{tagging}}'
        }
      },
      conditions: []
    }
  ],
  $leavingCustomActions: [
    {
      $id: '8dad2df2-9f18-437a-9829-cca240fd31fc',
      type: 'SetVariable',
      $title: 'countException',
      $invalid: false,
      settings: {
        variable: 'countException',
        value: '0'
      },
      conditions: [
        {
          $$hashKey: 'object:1819',
          source: 'context',
          comparison: 'notEquals',
          variable: 'processedInput',
          values: ['input inesperado']
        }
      ]
    }
  ],
  $inputSuggestions: [],
  $defaultOutput: {
    stateId: 'fallback',
    $invalid: false
  },
  $tags: [],
  id: 'global-actions',
  $invalidContentActions: false,
  $invalidOutputs: false,
  $invalidCustomActions: false,
  $invalid: false
};

export default GLOBAL_ACTIONS;
