let responseText = "";
let requrimentText="";
let wordKeys = [];
let problem = [];
let solution = [];
let type = [];
let recommend = new Array();

function fileRead() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "knowledgeBase.xml");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let xmlDoc = xhr.responseXML;
        let rules = xmlDoc.getElementsByTagName("rule");
        for (let i = 0; i < rules.length; i++) {
          let wordKeysElem = rules[i].getElementsByTagName("wordKey");
          let keys = [];
          for (let j = 0; j < wordKeysElem.length; j++) {
            keys.push(wordKeysElem[j].textContent);
          }
          wordKeys.push(keys);
          problem.push(rules[i].getElementsByTagName("problem")[0].textContent);
          solution.push(rules[i].getElementsByTagName("solution")[0].textContent);
          type.push(rules[i].getElementsByTagName("type")[0].textContent);
        }
        resolve();
      } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
        reject("Error loading file");
      }
    };
    xhr.send();
  });
}

//сохранили информацию из базы знаний
fileRead();

// Функция для закрытия попапа
const closeCurrentPage = () => {
  window.close();
}

// Функция для выполнения асинхронного запроса к активному табу
const saveInfoInActiveTabs = (tabs) => {
  return new Promise(async (resolve, reject) => {
    const currentUrl=tabs[0].url;
    let response = await fetch(currentUrl);
    responseText = await response.text();
    resolve();
  });
}

// Функция для обработки ошибки получения URL активного таба
const chromeTabsError = (error) => {
  console.error(`Error: ${error}`);
}

// Функция для анализа текста требований
const analizeRequrimentText = async () => {
  //делаем текст читаемым
  requrimentText = responseText.toLowerCase();

  //проверяем текст страницы, чтобы вернуть рекомендации
  for (let i=0; i<wordKeys.length; i++){
    if (!requrimentText.includes(wordKeys[i])) {
      //recommend.push(solution[i]);
      const form = document.querySelector('body');
      // Меняем содержимое новым HTML
      form.innerHTML = '';
      const h2Input = document.createElement("h2");
      if (type[i]=="error"){
        h2Input.className="error";
        h2Input.innerHTML = "Ошибка";
      }
      else{
        h2Input.className="warning";
        h2Input.innerHTML = "Рекомендация";
      }
      document.body.append(h2Input);
      const pInput = document.createElement("p");
      document.body.append(pInput);
      pInput.innerHTML = solution[i];
      const buttonInput = document.createElement("button");
      buttonInput.id=`okButton${i}`;
      if (type[i]=="error"){
        buttonInput.className="error";
      }
      else{
        buttonInput.className="warning";
      }
      buttonInput.style="float:right; width:125px;"
      document.body.append(buttonInput);
      buttonInput.innerHTML = "Исправлю";
      const result = await clickOnButton(buttonInput);
    }
  }
  createEndPopup();
}

// Функция для ожидания клика по кнопке
const clickOnButton = buttonInput => new Promise(resolve => {
  buttonInput.addEventListener('click', () => {
    resolve(1);
  });
});

// Функция для создания финального попапа
const createEndPopup = () => {
  const formEnd = document.querySelector('body');
  formEnd.innerHTML = '';
  const h2InputEnd = document.createElement("h2");
  document.body.append(h2InputEnd);
  h2InputEnd.innerHTML = "Готово";
  const pInputEnd = document.createElement("p");
  document.body.append(pInputEnd);
  pInputEnd.innerHTML = "Ошибок и рекомендаций по улучшению больше нет";
  const buttonInputEnd = document.createElement("button");
  document.body.append(buttonInputEnd);
  buttonInputEnd.className="primary";
  buttonInputEnd.style="float:right; width:125px;"
  buttonInputEnd.innerHTML = "Закрыть";
  buttonInputEnd.addEventListener('click', () => {
    closeCurrentPage();
  });
}

// Слушатель события на кнопке расширения браузерного плагина, при выборе кнопки запускается основная логика плагина
start.addEventListener('click', () => {
  var currentUrl = "";
  var chromeTabsError = "";
  chrome.tabs.query({ currentWindow: true, active: true }).then(async tabs => {
    await saveInfoInActiveTabs(tabs);
    // Здесь можно продолжить выполнение кода, который зависит от выполнения saveInfoInActiveTabs()
    analizeRequrimentText(); // Функция для анализа текста требований
  }, chromeTabsError);
});