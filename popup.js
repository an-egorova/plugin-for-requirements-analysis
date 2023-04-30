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
function saveData()
{

}
function createData()
{
  // Получаем текущую вкладку браузера
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Этот код выполняет запрос ко всем вкладкам, которые активны. Может быть только одна такая вкладка, поэтому к ней можно обратиться как tabs[0]. Если такая вкладка существует, то функция отображает ее id, а если не существует, то показывает сообщение об ошибке.
    const tab = tabs[0];
    /*chrome.tabs.executeScript({
      tabId: tab.id,
      file: "dataloading.js"
    });*/

    //****************ЛОГИРОВАНИЕ**********************************
    // определяем значения переменных
    let variable1 = tabs[0];
    let variable2 = tab.id;
    let variable3 = tab.URL;
    // создаем строку с данными переменных
    let fileContent = `Переменная 1: ${variable1}, Переменная 2: ${variable2}, Переменная 3: ${variable3}`;
    // создаем объект Blob с данными файла
    let file = new Blob([fileContent], {type: 'text/plain'});
    // создаем ссылку для скачивания файла
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = 'consoleError.txt';
    // добавляем ссылку на страницу и эмулируем клик для скачивания файла
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    //****************ЛОГИРОВАНИЕ**********************************

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js'],
    });
    /*const tab = tabs[0];
      if (tab) {
        // Получаем содержимое страницы из вкладки
        chrome.tabs.executeScript(tab.id, {
          code: 'document.documentElement.outerHTML',
        }, (result) => {
          // Записываем содержимое страницы в файл JSON
          const data = {
            url: tabs[0].url,
            content: result[0],
          };
          const json = JSON.stringify(data);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'data.json';
          link.click();
        });
    } 
    else {
    }   */ 
  });
  /*
  // Получаем текущий URL страницы
  //const url = window.location.href;
  const url = chrome.location.href;

  // Отправляем запрос на получение HTML кода страницы
  fetch(url)
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
    .catch(error => {
      console.error('Ошибка при получении HTML кода страницы', error);
    });*/
  /*
  chrome.tabs.
  chrome.tabs.executeScript(tabs[0].id, {
    code: 'document.documentElement.outerHTML',
  }, (result) => {
    // Записываем содержимое страницы в файл JSON
    const data = {
      url: tabs[0].url,
      content: result[0],
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
  });*/
}

// определяем функцию для создания всплывающего окна
/*function createPopupWindow() {
  const popupWindow = document.createElement('div');
  popupWindow.classList.add('popup');

  // создаем элементы управления формой
  const inputField = document.createElement('input');
  inputField.setAttribute('type', 'text');
  inputField.setAttribute('placeholder', 'Введите вопрос...');

  const submitButton = document.createElement('button');
  submitButton.innerHTML = 'Найти ответ';

  // добавляем элементы управления в окно
  popupWindow.appendChild(inputField);
  popupWindow.appendChild(submitButton);

  // обрабатываем событие отправки формы
  submitButton.addEventListener('click', (event) => 
  {
    event.preventDefault();

    // получаем текст из поля ввода
    const question = inputField.value;

    // отправляем запрос на сервер, чтобы получить ответ от экспертной системы
    fetch('/answer', 
    {
      method: 'POST',
      body: JSON.stringify({question}),
      headers: 
      {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result =>
      {
        if (result.error) 
        {
          alert(result.error); // выводим ошибку, если есть
          return;
        }

        // выводим ответ пользователю
        alert(result.answer);
      })
      .catch(error => console.error(error));
  });

  return popupWindow;
}

// добавляем слушатель события на кнопку расширения браузерного плагина
start.addEventListener('click',() => 
{
  const popup = createPopupWindow();

  // добавляем всплывающее окно на страницу
  document.body.appendChild(popup);
});*/