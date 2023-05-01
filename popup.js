// добавляем слушатель события на кнопку расширения браузерного плагина
start.addEventListener('click',() => 
{
  logButtonTap();
  //closeCurrentPage();
  createData();
});

function logButtonTap(){
  // Создаем новый элемент с указанным именем тега
  //const url = window.location.href;
  const div = document.createElement("div");
  div.id='newMessage';
  // Добавляем в конец body тег div
  document.body.append(div);
  // Вставка текста в тег div
  div.innerHTML = "<p>Кнопку нажали</p>";
  //div.innerHTML = url;
}
function closeCurrentPage() {
  window.close();
}

function createData()
{  
  var currentUrl = "";
  var chromeTabsError = "";
  chrome.tabs.query({ currentWindow: true, active: true }).then(saveInfoInActiveTabs, chromeTabsError);
}

async function saveInfoInActiveTabs(tabs) {
  //В переменной содержится информация об URL активного таба
  currentUrl=tabs[0].url;
  //В переменной содержится информация об URL активного таба
  fetch(currentUrl)
  .then(response => response.text())
  .then(html => {
    // Создаем объект для записи в файл
    const data = { html };
    // Конвертируем объект в JSON строку
    const jsonString = JSON.stringify(data);
    // Создаем ссылку для скачивания файла
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    link.download = 'data.json';
    // Добавляем ссылку на страницу и нажимаем на нее
    document.body.appendChild(link);
    link.click();
    // Удаляем ссылку
    document.body.removeChild(link);
  })
  .catch(error => console.error(error));

  /*
  fetch(currentUrl)
  .then(response => {return response.json()})
  .then((data) => {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //****************ЛОГИРОВАНИЕ**********************************
    // определяем значения переменных
    let variable2 = data;
    // создаем строку с данными переменных
    let fileContent2 = `Переменная 1: ${variable2}`;
    // создаем объект Blob с данными файла
    let file2 = new Blob([fileContent2], {type: 'text/plain'});
    // создаем ссылку для скачивания файла
    let downloadLink2 = document.createElement('a');
    downloadLink2.href = URL.createObjectURL(file);
    downloadLink2.download = 'saveInfoInActiveTabs.txt';
    // добавляем ссылку на страницу и эмулируем клик для скачивания файла
    document.body.appendChild(downloadLink2);
    downloadLink2.click();
    document.body.removeChild(downloadLink2);
    //****************ЛОГИРОВАНИЕ**********************************

  });*/
}

function chromeTabsError(error) {
  //В переменной содержится информация об ошибке получения URL активного таба
  chromeTabsError= `Error: ${error}`;
}



/*
//****************ЛОГИРОВАНИЕ**********************************
// определяем значения переменных
let variable1 = currentUrl;
// создаем строку с данными переменных
let fileContent = `Переменная 1: ${variable1}`;
// создаем объект Blob с данными файла
let file = new Blob([fileContent], {type: 'text/plain'});
// создаем ссылку для скачивания файла
let downloadLink = document.createElement('a');
downloadLink.href = URL.createObjectURL(file);
downloadLink.download = 'consoleErrorDataLoading.txt';
// добавляем ссылку на страницу и эмулируем клик для скачивания файла
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
//****************ЛОГИРОВАНИЕ**********************************
*/