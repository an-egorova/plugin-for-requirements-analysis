// добавляем слушатель события на кнопку расширения браузерного плагина
start.addEventListener('click',() => 
{
  logButtonTap();
  createData();
});

function logButtonTap(){
  // Создаем новый элемент с указанным именем тега
  const div = document.createElement("div");
  div.id='newMessage';
  // Добавляем в конец body тег div
  document.body.append(div);
  // Вставка текста в тег div
  div.innerHTML = "<p>Кнопку нажали</p>";
}

function createData()
{
  ch
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
  });
  
  /*
// Получаем текущую вкладку браузера
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  // Получаем содержимое страницы из вкладки
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
  });
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