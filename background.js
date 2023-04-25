// загрузка скрипта при запуске плагина
chrome.runtime.onInstalled.addListener(function() {
    // загрузка файла с базой знаний
    var knowledgeBase = loadKnowledgeBase('knowledgeBase.json');
    // регистрация контекстного меню
    createContextMenu(knowledgeBase);
  });
  
  // функция для загрузки базы знаний
  function loadKnowledgeBase(kbFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', kbFile, false);
    xhr.send();
    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    }
  }
  
  // функция для создания контекстного меню
  function createContextMenu(knowledgeBase) {
    chrome.contextMenus.create({
      title: "Проверить %s",
      contexts: ["selection"],
      onclick: function(info) {
        // получение выделенного текста
        var selectedText = info.selectionText;
        
        // вызов функции для обработки вопроса
        var answer = processQuestion(selectedText, knowledgeBase);
        
        // вывод ответа
        alert(answer);
      }
    });
  }
  
  // функция для обработки вопроса
  function processQuestion(question, knowledgeBase) {
    // поиск ответа в базе знаний
    for (var i = 0; i < knowledgeBase.length; i++) {
      var rule = knowledgeBase[i];
      var regex = new RegExp(rule.trigger, 'ig');
      if (regex.test(question)) {
        return rule.answer;
      }
    }
    
    // если ответ не найден, вернуть сообщение об ошибке
    return "Извините, я не знаю ответ на этот вопрос.";
  }
  