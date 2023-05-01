chrome.tabs.query({ currentWindow: true, active: true }).then(saveInfoInActiveTabs, chromeTabsError);
 
function saveInfoInActiveTabs(tabs) {
  //В переменной содержится информация об URL активного таба
  currentUrl=tabs[0].url;
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
}

function chromeTabsError(error) {
  //В переменной содержится информация об ошибке получения URL активного таба
  chromeTabsError= `Error: ${error}`;
}