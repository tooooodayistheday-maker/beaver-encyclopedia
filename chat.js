window.eightChatConfig = { encryptedOrgId: 'zbKDXBGe2WgwKw==', env: 'prod', launchLocation: 'https://live-chat-console.no8.io' };
(function () {
 var eightChatId = 'eight-chat-script';
 if (document.getElementById(eightChatId)) return;
 var firstScriptElement = document.getElementsByTagName('script')[0];
 var eightChatScriptElement = document.createElement('script');
 eightChatScriptElement.id = eightChatId;
 eightChatScriptElement.src = window.eightChatConfig.launchLocation + '/launch.js';
 firstScriptElement.parentNode.insertBefore(eightChatScriptElement, firstScriptElement);
})();
