 // Получаем текущий URL страницы
  const url = chrome.location.href;
    //****************ЛОГИРОВАНИЕ**********************************
    // определяем значения переменных
    let variable1 = url;
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
    });