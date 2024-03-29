export const dataCy = (value: string, additionalCommand = '') => cy.get(`[data-cy="${value}"]${additionalCommand}`);

/**
 * Function that get one input by dataCy, clear it's content, write in the specified value and then click enter
 */
export const typeEnter = (input: string, value: string = '') => cy.dataCy(input).clear().type(`${value}{enter}`);
