// Логика добавления ингредиентов вынесена в отдельную функцию, для того чтобы избежать дублирования
function addIngredients(listOfIndexes, customCallback?) {
  listOfIndexes.forEach((index) => {
    cy.get('.TschaSuz4Fx6SIwt3Bs9')
      .eq(index)
      .find('li')
      .eq(0)
      .find('button.common_button')
      .should('have.text', 'Добавить')
      .click();

    if (customCallback) {
      customCallback(index);
    }
  });
}

// Закрытие модалки по кнопке/оверлею
function closeModal(clickOutside = false) {
  cy.get('.xqsNTMuGR8DdWtMkOGiM') // Находим модалку
      .find('div:nth-child(1) button') // Находим второй див с кнопкой
      .should('exist') // Должен существовать
      .click() // Кликаем
    if (clickOutside) {
      cy.get('body').click(0,0) // Находим боди и кликаем в верхний левый угол
    }
}

// Функция открытия модалки
function openModal() {
  cy.get('.TschaSuz4Fx6SIwt3Bs9') // Находим ul с ингредиентами
      .should('exist') // Должны существовать
      .eq(0) // Выбираем первый ul
      .find('li') // Находим li
      .click() // Кликаем
}

const listOfIndexes = [0, 1, 2]; // Индексы для теста

describe('Тестирование конструктора бургеров', function() {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', '/api/ingredients', {
        statusCode: 200,
        body: ingredients,
      }).as('getIngredients');
    });
    cy.visit('http://localhost:4000');
  });
  
  it('проверяет отображение моковых данных', function () {
    cy.wait('@getIngredients'); // Ждем завершения запроса
    
    // Ожидаемые данные
    const expectedData = [
      { index: 0, text: 'testBun' },
      { index: 1, text: 'testMain' },
      { index: 2, text: 'testSauce' },
    ];
  
    expectedData.forEach(({ index, text }) => {
      cy.get('.TschaSuz4Fx6SIwt3Bs9') // Находим списки ul
        .eq(index) // Выбираем элемент по индексу
        .find('li')
        .eq(0)
        .find('a p.text.text_type_main-default') // Находим <p> внутри ссылки
        .should('have.text', text); // Проверяем текст
    });
  });

  it('Добавление ингредиентов в конструктор', function () {
    addIngredients(listOfIndexes, (index) => {
      if (index === 0) {
        cy.get('.R0Ja10_UixREbmJ6qzGV .constructor-element_pos_top')
          .should('exist')
          .and('contain', 'testBun');
        cy.get('.R0Ja10_UixREbmJ6qzGV .constructor-element_pos_bottom')
          .should('exist')
          .and('contain', 'testBun');
      } else {
        cy.get('.R0Ja10_UixREbmJ6qzGV ul')
          .should('exist')
          .and('contain', index === 1 ? 'testMain' : 'testSauce');
      }
    });
  });

  it('Проверка модального окна ингредиента', function () {
    openModal() // Открываем модалку
    cy.get('.xqsNTMuGR8DdWtMkOGiM') // Находим модалку
      .should('exist') // Должна существовать
  })

  it('Закрытие модального окна ингредиента по крестику', function () {
    openModal() // Открываем модалку
    closeModal(); // Закрываем модалку по кнопке
    cy.get('.xqsNTMuGR8DdWtMkOGiM').should('not.exist') // Модалки не должно существовать
  })

  it('Закрытие модального окна ингредиента по оверлею', function () {
    openModal() // Открываем модалку
    closeModal(true) // Закрываем модалку по оверлею
    cy.get('.xqsNTMuGR8DdWtMkOGiM').should('not.exist') // Проверяем что модалки нет
  })
});

describe('Тестирование получения данных пользователя', function () {
  beforeEach(() => {
    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: user,
      }).as('getUser');
    });

    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', '/api/ingredients', {
        statusCode: 200,
        body: ingredients,
      }).as('getIngredients');
    });

    cy.fixture('order.json').then((order) => {
      cy.intercept('POST', '/api/orders', {
        statusCode: 200,
        body: order,
      }).as('createOrder');
    });

    // Устанавливаем моковый токен в cookies
    cy.setCookie('accessToken', 'mocked-access-token');

    // Устанавливаем фейковый refreshToken в localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mocked-refresh-token');
    });

    // Переходим на страницу приложения
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Проверяет успешное получение данных пользователя', function () {
    // Ждём завершения запроса
    cy.wait('@getUser').then((interception) => {
      // Проверяем, что запрос был выполнен с правильным токеном
      expect(interception.request.headers.authorization).to.equal('mocked-access-token');

      // Проверяем ответ API
      cy.fixture('user.json').then((user) => {
        expect(interception.response.body).to.deep.equal(user);
      });
    });

    // Собираем бургер
    addIngredients(listOfIndexes) // Добавляем ингридиенты
    cy.get('.R0Ja10_UixREbmJ6qzGV') // Находим секцию с конструктором
    .find('div:nth-child(4) button').click() // Находим и кликаем по кнопке оформления заказа

    cy.wait('@createOrder').then((interception) => {
      cy.get('.xqsNTMuGR8DdWtMkOGiM').should('exist') // Проверяем открылась ли модалка
        .find('div:nth-child(2) h2') // Находим див с h2 номером заказа
        .should('have.text', '123456') // Проверяем что номер заказа соответствует

      cy.get('.xqsNTMuGR8DdWtMkOGiM').find('div:nth-child(1) button') // Находим модалку и кнопку закрытия
        .click()
      cy.get('.xqsNTMuGR8DdWtMkOGiM').should('not.exist') // Проверяем что модалка закрыта
      
      // Проверяем очищен ли конструктор
      cy.get('.R0Ja10_UixREbmJ6qzGV .constructor-element_pos_top').should('not.exist')
      cy.get('.R0Ja10_UixREbmJ6qzGV ul div').should('have.text', 'Выберите начинку')
      cy.get('.R0Ja10_UixREbmJ6qzGV .constructor-element_pos_bottom').should('not.exist')
      cy.get('.R0Ja10_UixREbmJ6qzGV').find('div:nth-child(4) div p.text').should('have.text', 0)
    })
  });
});