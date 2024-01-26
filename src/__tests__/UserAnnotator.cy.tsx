import { useLoaderData, useParams } from 'react-router-dom';
import App from '../App';
import { cache } from '../common/utils';
import {
    ANNOTATION_ITEM_1,
    ANNOTATION_ITEM_2,
    CANVAS_FOR_CURSOR,
    HOME_BEGIN_BUTTON,
    JOB_ITEM_1,
    MOUSE_X_POSITION,
    MOUSE_Y_POSITION,
    SELECT_LABEL_1,
    SELECT_LABEL_2,
    VISIBILITY_BUTTON_1,
    ZOOM_IN_BUTTON
} from './selectors';

const expected_text_no_annotation_yet = "Pas encore d'annotation effectuée.";

describe('Test UserAnnotator', () => {
    it('Should test annotator for the user.', () => {
        cy.fixture('/auth/whoami.json').then(cache.setWhoami);
        cy.fixture('/auth/access-token.txt').then(cache.setAccessToken);
        cy.intercept('GET', '/teams/team-id-1/jobs', { fixture: '/data/jobs.json' });
        cy.intercept('GET', '/teams/team-id-1/jobs/job-id-1', { fixture: '/data/job.json' });
        cy.intercept('GET', '/teams/team-id-1/jobs/job-id-1/task', { fixture: '/data/task.json' });
        cy.intercept('GET', '/users/user-id-1/tasks/task-id-1/annotations', []);
        cy.intercept('GET', 'http://dummy-url.com/image', { fixture: '/assets/annotation-image-1' });

        cy.fixture('/data/jobs.json').then(jobs => {
            cy.stub({ useLoaderData }, 'useLoaderData').callsFake(() => jobs);
            cy.stub({ useParams }, 'useParams').callsFake(() => ({ teamId: jobs[0].teamId }));
        });

        cy.mount(<App />);

        cy.dataCy(HOME_BEGIN_BUTTON).click();

        cy.contains('Liste des jobs');
        cy.contains('Test Task 1');
        cy.contains('À refaire');
        cy.contains('Labelles');
        cy.contains('95/100 Taches restantes');

        cy.dataCy(JOB_ITEM_1).click();

        cy.contains(expected_text_no_annotation_yet);

        for (let a = 0; a < 10; a++) cy.dataCy(ZOOM_IN_BUTTON).click();

        cy.dataCy(CANVAS_FOR_CURSOR).click(0, 0, { force: true });

        cy.dataCy(MOUSE_X_POSITION).contains('0');
        cy.dataCy(MOUSE_Y_POSITION).contains('0');

        cy.dataCy(CANVAS_FOR_CURSOR).click(3710, 0, { force: true });
        cy.dataCy(MOUSE_X_POSITION).contains('1314');
        cy.dataCy(MOUSE_Y_POSITION).contains('0');

        cy.dataCy(CANVAS_FOR_CURSOR).click(0, 2389, { force: true });
        cy.dataCy(MOUSE_X_POSITION).contains('0');
        cy.dataCy(MOUSE_Y_POSITION).contains('1212');

        cy.dataCy(CANVAS_FOR_CURSOR).click(3710, 2389, { force: true });
        cy.dataCy(MOUSE_X_POSITION).contains('1314');
        cy.dataCy(MOUSE_Y_POSITION).contains('1212');

        cy.dataCy(CANVAS_FOR_CURSOR).click(2000, 1000, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(2500, 1500, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(3000, 1000, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(2000, 1000, { force: true });

        let expectedFirstSelectValue = '';
        cy.dataCy(ANNOTATION_ITEM_1).should('exist');
        cy.dataCy(VISIBILITY_BUTTON_1).dblclick();
        cy.dataCy(SELECT_LABEL_1).get('input').should('have.value', expectedFirstSelectValue);

        expectedFirstSelectValue = 'ROOF';
        const optionToSelect = 'ROOF';
        cy.dataCy(SELECT_LABEL_1).click();
        cy.contains(optionToSelect).click();
        cy.dataCy(SELECT_LABEL_1).get('input').should('have.value', expectedFirstSelectValue);

        cy.dataCy(CANVAS_FOR_CURSOR).click(1500, 900, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(1600, 1200, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(1700, 900, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(1500, 900, { force: true });
        cy.dataCy(CANVAS_FOR_CURSOR).click(1600, 1200, { force: true });

        cy.dataCy(ANNOTATION_ITEM_2).should('exist');
        cy.dataCy(SELECT_LABEL_2).get('input').should('have.value', expectedFirstSelectValue);

        const secondOptionToSelect = 'VELUX';
        const expectedSecondSelectValue = 'VELUX';
        cy.dataCy(SELECT_LABEL_2).click();
        cy.contains(secondOptionToSelect)
            .click()
            .then(() => {});
        cy.dataCy(ANNOTATION_ITEM_2).dataCy(SELECT_LABEL_2, ' input').should('have.value', expectedSecondSelectValue);
    });
});
