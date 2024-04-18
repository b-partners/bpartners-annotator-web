import { useLoaderData, useParams } from 'react-router-dom';
import App from '../App';
import { cache } from '../common/utils';
import { HOME_BEGIN_BUTTON, JOB_ITEM_1, SEARCH_JOB } from './selectors';

describe('Test UserAnnotator', () => {
    it('Should test annotator for the user.', () => {
        cy.fixture('/auth/whoami.json').then(cache.setWhoami);
        cy.fixture('/auth/api-key.txt').then(cache.setApiKey);
        cy.intercept('GET', '/jobs?**', { fixture: '/data/jobs.json' });
        cy.intercept('GET', '/jobs/job-id-1**', { fixture: '/data/job.json' });
        cy.intercept('GET', '/jobs/job-id-1/task?**', { fixture: '/data/admin-tasks.json' });
        cy.intercept('GET', 'http://dummy-url.com/image', { fixture: '/assets/annotation-image-1' });
        cy.intercept('GET', 'jobs/job-id-1/tasks/task-id-1/annotations?**', { fixture: '/data/admin-task-1.json' });
        
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

        cy.contains("Test Task 1")
        cy.contains("Test Task 2")
        cy.contains("Test Task 3")

        cy.fixture('/data/jobs.json').then(data => {
            cy.intercept('GET', '/jobs?**', [data[0]]).as('searchTask');
        });
        cy.dataCy(SEARCH_JOB).type('Task 1');

        cy.contains("Test Task 2").should("not.exist")
        cy.contains("Test Task 3").should("not.exist")

        cy.dataCy(JOB_ITEM_1).click()

        cy.contains("ROOF")
        cy.contains("image-name-1")
    });
});
