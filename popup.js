let responseText = "";
let requrimentText="";
let headerText = "";
let paragraphs=[];
let header=[];
let rules = [];


function fileRead() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const xmlDoc = this.responseXML;
      const rulesArr = xmlDoc.getElementsByTagName("rule");

      for (let i = 0; i < rulesArr.length; i++) {
        const rule = rulesArr[i];
        const id = parseInt(rule.getElementsByTagName("id")[0]?.childNodes[0]?.nodeValue);
        const before = rule.getElementsByTagName("before")[0]?.childNodes[0]?.nodeValue === 'true';
        const countWarriable = parseInt(rule.getElementsByTagName("countWarriable")[0]?.childNodes[0]?.nodeValue);
        const hasFirst = rule.getElementsByTagName("hasFirst")[0]?.childNodes[0]?.nodeValue === 'true';
        const keeWordsFirstElems = rule.getElementsByTagName("keeWordFirst");
        const keeWordsFirst = keeWordsFirstElems.length > 0 ? Array.from(keeWordsFirstElems).map((el) => el.childNodes[0]?.nodeValue) : [];
        const hasSecond = rule.getElementsByTagName("hasSecond")[0]?.childNodes[0]?.nodeValue === 'true';
        const keeWordsSecondElems = rule.getElementsByTagName("keeWordSecond");
        const keeWordsSecond = keeWordsSecondElems.length > 0 ? Array.from(keeWordsSecondElems).map((el) => el.childNodes[0]?.nodeValue) : [];
        const styleType = rule.getElementsByTagName("styleType")[0]?.childNodes[0]?.nodeValue;
        const solution = rule.getElementsByTagName("solution")[0]?.childNodes[0]?.nodeValue;
        const description = rule.getElementsByTagName("description")[0]?.childNodes[0]?.nodeValue;
        
        const ruleObj = {
          id: id,
          before: before,
          countWarriable: countWarriable,
          hasFirst: hasFirst,
          keeWordsFirst: keeWordsFirst,
          hasSecond: hasSecond,
          keeWordsSecond: keeWordsSecond,
          styleType: styleType,
          solution: solution,
          description: description
        };

        rules.push(ruleObj);
      }

    }
  };
  xhr.open("GET", "knowledgeBase.xml");
  xhr.send();
}

//сохранили информацию из базы знаний
fileRead();

// Функция для закрытия попапа
const closeCurrentPage = () => {
  window.close();
}

// Измененная функция для выполнения асинхронного запроса к активному табу
const saveInfoInActiveTabs = (tabs) => {
  return new Promise(async (resolve, reject) => {
    const currentUrl = tabs[0].url;
    let response = await fetch(currentUrl);
    responseText = await response.text();
    const paragraphRegex = /<p>(.*?)<\/p>/g; // Регулярное выражение для поиска элементов <p></p>
    const headerRegex = /<(h1|h2|h3|h4|h5)>(.*?)<\/(h1|h2|h3|h4|h5)>/g; // Регулярное выражение для поиска элементов <h1></h1>, <h2></h2>, <h3></h3>
    paragraphs = responseText.match(paragraphRegex); // Находим все элементы <p></p> в ответе и записываем их в массив
    header = responseText.match(headerRegex); // Находим все элементы <h1></h1>, <h2></h2>, <h3></h3> в ответе и записываем их в массив
    resolve({ paragraphs, header });
  });
}

// Функция для обработки ошибки получения URL активного таба
const chromeTabsError = (error) => {
  console.error(`Error: ${error}`);
}
// Функция для обновления содержимого попапа
function updatePopup(i, rule, buttonInput) {
  const form = document.querySelector('body');
  // Очищаем содержимое формы
  form.innerHTML = '';
  
  const h2Input = document.createElement("h2");
  const pInput = document.createElement("p");
  if (rule.styleType == "error"){
    h2Input.className = "error";
    buttonInput.className = "error";
  } else if (rule.styleType == "warning"){
    h2Input.className = "warning";
    buttonInput.className = "warning";
  }
  h2Input.innerHTML = rule.styleType === 'error' ? 'Ошибка' : 'Рекомендация';
  pInput.innerHTML = rule.solution;
  buttonInput.id = `okButton${i}`;
  buttonInput.style = "float:right; width:125px;"
  
  form.appendChild(h2Input);
  form.appendChild(pInput);
  form.appendChild(buttonInput);
  buttonInput.textContent = "Исправлю";
}

// Функция для анализа текста требований
async function analizeRequrimentText() {
  let requrimentText = "";
  
  // Делаем текст читаемым
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i] = paragraphs[i].toLowerCase();
    requrimentText += paragraphs[i];
  }

  // Делаем текст читаемым
  for (let i = 0; i < header.length; i++) {
    header[i] = header[i].toLowerCase();
    headerText += header[i];
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    // Проверяем условие before == true
    if (rule.before) {
      if (rule.countWarriable==0){
        const buttonInput = document.createElement("button");
        updatePopup(i, rule, buttonInput);
        const result = await clickOnButton(buttonInput);
      }
      else if (rule.countWarriable==1){
        if (rule.hasFirst){
          if (headerText.includes(rule.keeWordsFirst[i])){
            const buttonInput = document.createElement("button");
            updatePopup(i, rule, buttonInput);
            const result = await clickOnButton(buttonInput);
          }
        } else {
          if (!headerText.includes(rule.keeWordsFirst[i])){
            const buttonInput = document.createElement("button");
            updatePopup(i, rule, buttonInput);
            const result = await clickOnButton(buttonInput);
          }
        }
      }
      else if (rule.countWarriable==2){
        if (rule.hasFirst){
          if (rule.hasSecond){
            if (
              headerText.includes(rule.keeWordsFirst[i]) &&
              requrimentText.includes(rule.keeWordsSecond[i])
            ) {
              const buttonInput = document.createElement("button");
              updatePopup(i, rule, buttonInput);
              const result = await clickOnButton(buttonInput);
            }
          }
          else{
            if (
              headerText.includes(rule.keeWordsFirst[i]) &&
              !requrimentText.includes(rule.keeWordsSecond[i])
            ) {
              const buttonInput = document.createElement("button");
              updatePopup(i, rule, buttonInput);
              const result = await clickOnButton(buttonInput);
            }
          }
        }
        else {                 
          if (rule.hasSecond){
            if (
              !headerText.includes(rule.keeWordsFirst[i]) &&
              requrimentText.includes(rule.keeWordsSecond[i])
            ) {
              const buttonInput = document.createElement("button");
              updatePopup(i, rule, buttonInput);
              const result = await clickOnButton(buttonInput);
            }
          }
          else {
            if (
              !headerText.includes(rule.keeWordsFirst[i]) &&
              !requrimentText.includes(rule.keeWordsSecond[i])
            ) {
              const buttonInput = document.createElement("button");
              updatePopup(i, rule, buttonInput);
              const result = await clickOnButton(buttonInput);
            }
          }
        }
      }
    } else {
      // Проверяем условие before == false
      if (
        requrimentText.includes(rule.keeWordsFirst) &&
        !requrimentText.includes(rule.keeWordsSecond)
      ) {
        const buttonInput = document.createElement("button");
        updatePopup(i, rule, buttonInput);
        const result = await clickOnButton(buttonInput);
      }
    }
  }
  // Добавляем сообщение о завершении проверки
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

// Создаем слушателя click на окне popup
window.addEventListener("click", function(event) {
  const isInsidePopup = event.composedPath().some(function(node) {
    return node.id == "popup";
  });
  if (!isInsidePopup) {
    event.preventDefault();
  }
});