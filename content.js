// Определение функции для взаимодействия с браузерным API
function sendToBackground(message, callback) {
    chrome.runtime.sendMessage(message, callback);
}

// Обработка события загрузки страницы
window.addEventListener("load", function () {
    // Получение данных о текущей странице
    var pageInfo = {
        title: document.title,
        url: window.location.href,
        // Дополнительные данные о странице...
    };

    // Отправка данных на обработку экспертной системе
    sendToBackground({type: "page_info", data: pageInfo}, function (response) {
        // Обработка ответа от экспертной системы
        if (response.success) {
            // Результаты обработки данных...
        } else {
            // Обработка ошибок...
        }
    });
});
