import { useParams } from 'react-router-dom';
import App from '../App';
import { cache } from '../common/utils';
import {
    ANNOTATION_COMMENT_BUTTON,
    ANNOTATION_COMMENT_INPUT,
    EXPORT_DIALOG_CANCEL_BUTTON,
    EXPORT_DIALOG_EXPORT_BUTTON,
    EXPORT_EMAIL_INPUT,
    EXPORT_FORMAT_INPUT,
    EXPORT_JOB,
    HOME_BEGIN_BUTTON,
    JOB_ITEM_1,
    REJECT_COMMENT,
    REJECT_DIALOG_CANCEL_BUTTON,
    REJECT_DIALOG_REJECT_BUTTON,
    SEARCH_JOB,
} from './selectors';

describe('Test UserAnnotator', () => {
    it('Should test annotator for the admin.', () => {
        cy.fixture('/auth/whoami.json').then(cache.setWhoami);
        cy.fixture('/auth/api-key.txt').then(cache.setApiKey);
        cy.intercept('GET', '/jobs?**', { fixture: '/data/jobs.json' });
        cy.intercept('GET', '/jobs/job-id-1**', { fixture: '/data/job.json' });
        cy.intercept('GET', '/jobs/job-id-1/task?**', { fixture: '/data/admin-tasks.json' });
        cy.intercept('GET', 'http://dummy-url.com/image', { fixture: '/assets/annotation-image-1' });
        cy.intercept('GET', 'jobs/job-id-1/tasks/task-id-1/annotations?**', { fixture: '/data/admin-task-1.json' });

        cy.fixture('/data/jobs.json').then(jobs => {
            cy.stub({ useParams }, 'useParams').callsFake(() => ({ teamId: jobs[0].teamId }));
        });

        cy.mount(<App />);

        cy.dataCy(HOME_BEGIN_BUTTON).click();

        cy.contains('Liste des jobs');
        cy.contains('Test Task 1');
        cy.contains('À refaire');
        cy.contains('Labelles');
        cy.contains('95/100 Taches restantes');

        cy.contains('Test Task 1');
        cy.contains('Test Task 2');
        cy.contains('Test Task 3');

        cy.dataCy(EXPORT_JOB).click();
        cy.dataCy(EXPORT_DIALOG_CANCEL_BUTTON).click();
        cy.dataCy(EXPORT_JOB).click();

        cy.contains('Export de job');
        cy.contains('id: job-id-3');

        cy.dataCy(EXPORT_EMAIL_INPUT).type('test@gmail.com');
        cy.dataCy(EXPORT_FORMAT_INPUT).click();
        cy.contains('VGG').click();
        cy.intercept('GET', '/jobs/job-id-3/export?**', 'ok');
        cy.dataCy(EXPORT_DIALOG_EXPORT_BUTTON).click();

        cy.contains('Job exporté avec succès');

        cy.fixture('/data/jobs.json').then(data => {
            cy.intercept('GET', '/jobs?**', [data[0]]).as('searchTask');
        });
        cy.dataCy(SEARCH_JOB).type('Task 1');

        cy.contains('Test Task 2').should('not.exist');
        cy.contains('Test Task 3').should('not.exist');

        cy.dataCy(JOB_ITEM_1).click();

        cy.contains('ROOF');
        cy.contains('image-name-1');

        cy.dataCy(ANNOTATION_COMMENT_BUTTON).click();
        cy.dataCy(ANNOTATION_COMMENT_INPUT).type('Dummy comment');

        cy.get('[name="Rejeter"]').click();

        cy.dataCy(REJECT_DIALOG_CANCEL_BUTTON).click();

        cy.get('[name="Rejeter"]').click();

        cy.contains("Rejet d'annotation");
        cy.contains('id: task-id-1');
        cy.contains('Veuillez commenté ci dessous la raison du rejet de cette annotation.');

        cy.dataCy(REJECT_COMMENT).type('dummy test comment');

        cy.intercept('PUT', '/jobs/job-id-1/tasks/task-id-1/annotations/task-id-1/reviews/**', 'ok');

        cy.dataCy(REJECT_DIALOG_REJECT_BUTTON).click();

        cy.get('[name="Valider"]').click();
    });
});
