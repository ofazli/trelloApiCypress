/// <reference types="cypress" />

describe("Cypress Trello Api Test", () => {
  const apiKey = Cypress.env("apiKey");
  const token = Cypress.env("token");
  let boardId;
  let listId;
  let cardIds = [];
  const boardName = "testBoard";
  const cardNames = ["Card 1", "Card 2"];

  it("should create a new Trello board", () => {
    cy.request({
      method: "POST",
      url: `/boards/?key=${apiKey}&token=${token}&name=${boardName}`,
    }).then((response) => {
      boardId = response.body.id;
      cy.log(`Oluşturulan board'un ID'si: ${boardId}`);
    });
  });
  it("should create a list in the board", () => {
    cy.request({
      method: "POST",
      url: `/lists/?key=${apiKey}&token=${token}&idBoard=${boardId}&name=testList`,
    }).then((response) => {
      listId = response.body.id;
      cy.log(`Oluşturulan list'in ID'si: ${listId}`);
    });
  });
  it("should create two cards in the list", () => {
    cardNames.forEach((cardName) => {
      cy.request({
        method: "POST",
        url: `/cards/?key=${apiKey}&token=${token}&idList=${listId}&name=${cardName}`,
      }).then((response) => {
        const cardId = response.body.id;
        cardIds.push(cardId);
        cy.log(`Created card ID: ${cardId}`);
      });
    });
  });
  it("should update a random card", () => {
    const randomCardId = cardIds[Math.floor(Math.random() * cardIds.length)];
    const newCardName = "Updated Card Name";

    cy.request({
      method: "PUT",
      url: `/cards/${randomCardId}?key=${apiKey}&token=${token}&name=${newCardName}`,
    }).then((response) => {
      cy.log(`Updated card ID: ${response.body.id}`);
    });
  });
  it("should delete all cards", () => {
    cardIds.forEach((cardId) => {
      cy.request({
        method: "DELETE",
        url: `/cards/${cardId}?key=${apiKey}&token=${token}`,
      }).then((response) => {
        cy.log(`Deleted card ID: ${cardId}`);
      });
    });
  });
  it("should delete the board", () => {
    cy.request({
      method: "DELETE",
      url: `/boards/${boardId}?key=${apiKey}&token=${token}`,
    }).then((response) => {
      cy.log(`Deleted board ID: ${boardId}`);
    });
  });
});
