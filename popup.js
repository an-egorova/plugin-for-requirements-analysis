let responseText = "";
let requrimentText="";

// слушатель события на кнопке расширения браузерного плагина, при выборе кнопки запускается основная логика плагина
start.addEventListener('click',() => 
{
  var currentUrl = "";
  var chromeTabsError = "";
  chrome.tabs.query({ currentWindow: true, active: true }).then(async function(tabs) {
    await saveInfoInActiveTabs(tabs);
    // здесь можно продолжить выполнение кода, который зависит от выполнения saveInfoInActiveTabs()
    analizeRequrimentText(); //функция для анализа текста требований
  }, chromeTabsError);
});

// функция закрывает попап
function closeCurrentPage() {
  window.close();
}

// нужна для работы saveReqInfo(), выполняет асинхронный запрос к активному табу
function saveInfoInActiveTabs(tabs) {
  return new Promise(async function(resolve, reject) {
    currentUrl=tabs[0].url;
    let response = await fetch(currentUrl);
    responseText = await response.text();
    resolve();
  });
}

// нужна для работы saveReqInfo(), содержит информацию об ошибке
function chromeTabsError(error) {
  //В переменной содержится информация об ошибке получения URL активного таба
  chromeTabsError= `Error: ${error}`;
}

//функция для анализа текста требований
async function analizeRequrimentText(){
  let recommend = new Array();
  requrimentText = responseText.toLowerCase();

  recommend.push(analizeProblem()); //проблема
  recommend.push(analizeGoal()); //цель
  recommend.push(analizeRestriction()); //ограничения
  recommend.push(analizeRole()); //роли
  analizeBPMN(); //схема процесса
  analizeUC(); //сценарии

  recommend = recommend.filter(element => element !== 0); // удаляем все нулевые элементы
  
  for (let i=0; i<recommend.length; i++){
    const form = document.querySelector('body')
    // Меняем содержимое новым html
    form.innerHTML = ''
    const h2Input = document.createElement("h2");
    h2Input.className="error";
    document.body.append(h2Input);
    h2Input.innerHTML = "Ошибка";
    const pInput = document.createElement("p");
    document.body.append(pInput);
    pInput.innerHTML = recommend[i];
    const buttonInput = document.createElement("button");
    buttonInput.id=`okButton${i}`;
    buttonInput.className="error";
    buttonInput.style="float:right; width:125px;"
    document.body.append(buttonInput);
    buttonInput.innerHTML = "Исправлю";
    const result = await clickOnButton(buttonInput);
    //clickOnButton(buttonInput).then(result => alert(result));
  } 
  createEndPopup();
}

async function clickOnButton(buttonInput) {
  return new Promise(resolve => {
    buttonInput.addEventListener('click', () => {
      resolve(1);
    });
  });
}

function createEndPopup(){
  const formEnd = document.querySelector('body')
  formEnd.innerHTML = ''
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
function analizeProblem(){
  //определяем есть ли проблема, если нет, то выводим ошибку
  if (requrimentText.includes("проблема")==false){
      return "В тексте нет упоминаний о проблеме, инициировавшей разработку";
  }
  else{
    return 0;
  }
  /*
      o	Можем ли понять цель пользователя? Если хотят что-то, то для чего? Зачем?
      o	В чем неудобство? Если делают что-то неудобно, то почему это неудобно?
      o	Это фича есть у конкурентов, но ее нет у нас? Что нам даст разработка этой фичи? Будет ли удобно пользователю?
   */
}

function analizeGoal(){
  //определяем есть ли цель, если нет, то выводим ошибку
  if (requrimentText.includes("цель")==false){
    return "В тексте нет упоминаний о цели разработки";
  }
  else{
    return 0;
  }
  /*
      o	Коротко указаны требуемые доработки, проверить все ли указали в цели? Проверить бы что то, что будет реализовано, решит проблему пользователя
   */
}

//они есть не всегда, тут надо другое
function analizeRestriction(){
  //определяем есть ли ограничения, если нет, то выводим ошибку
  if (requrimentText.includes("ограничения")==false){
    return"В тексте нет упоминаний об ограничениях";
  }
  else{
    return 0;
  }
  /*
      o	В качестве рекомендации просьба проверить, что указаны нереализуемые доработки (цель пользователя не вся будет закрыта);
      o	Есть сценарии, которые проверить нельзя;
      o	Есть зависимости между задачами
  */
}

function analizeRole(){
  //определяем есть ли ограничения, если нет, то выводим ошибку
  if (requrimentText.includes("роли")==false){
    return "В тексте нет упоминаний о ролях пользователей, которым доступен дорабатываемый функуционал";
  }
  else{
    return 0;
  }
  /*
      o	Дорабатываем функционал? Для кого?
      o	Дорабатываем что-то с конкретной закупкой, то кто пользователь в закупке?
      o	Задавать вопрос нужен ли Оператору функционал? Если нет, то нужно ли вынести это в ограничения (нельзя проверить)?
  */
}

function analizeBPMN(){
  let selectWord = ["добавить логик", "изменить логик", "доработать логик"];

  //определяем есть ли упоминания доработки/изменения логики, если нет, то выводим ошибку
  for (let i = 0; i < selectWord.length; i++) {
      if (requrimentText.includes(selectWord[i])) {
         console.log("В тексте указано что будет дорабатываться логика, но нет схемы процесса");

        //ЛОГИРОВАНИЕ НА ФОРМЕ ПОПАПА
        const div = document.createElement("div");
        div.id='newMessage';
        document.body.append(div);
        div.innerHTML = "<p>Нет схем</p>";
        //ЛОГИРОВАНИЕ НА ФОРМЕ ПОПАПА
      }
   }
  /*
      o	Должна быть когда есть доработка бизнес-процесса или новый функционал (новый процесс)
  */
}

function analizeUC(){
  let selectWord = ["добавить логик", "изменить логик", "доработать логик"];

  //определяем есть ли упоминания доработки/изменения логики, если да, то выводим текст
  for (let i = 0; i < selectWord.length; i++) {
      if (requrimentText.includes(selectWord[i])) {
         console.log("В тексте указано что будет дорабатываться логика, но нет описания новых сценариев работы");

        //ЛОГИРОВАНИЕ НА ФОРМЕ ПОПАПА
        const div = document.createElement("div");
        div.id='newMessage';
        document.body.append(div);
        div.innerHTML = "<p>Нет сценариев</p>";
        //ЛОГИРОВАНИЕ НА ФОРМЕ ПОПАПА
      }
   }
  /*
      o	А они не нужны только если мы просто делаем переименовку/добавление полей/блоков на форму без условий
  */
}