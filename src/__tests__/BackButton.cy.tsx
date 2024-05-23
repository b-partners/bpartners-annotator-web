import { useParams } from 'react-router-dom';
import App from '../App';
import { cache } from '../common/utils';
import { authProvider } from '../providers';
import { HOME_BEGIN_BUTTON, JOB_ITEM_1, TOP_BACK_BUTTON } from './selectors';

describe('Test top back button', () => {
    it('Should test back button the user.', () => {
        cy.fixture('/auth/whoami.json').then(cache.setWhoami);
        cy.fixture('/auth/access-token.txt').then(cache.setAccessToken);
        cy.intercept('GET', '/teams/team-id-1/jobs**', { fixture: '/data/jobs.json' });
        cy.intercept('GET', '/teams/team-id-1/jobs/job-id-1**', { fixture: '/data/job.json' });
        cy.intercept('GET', '/teams/team-id-1/jobs/job-id-1/task**', { fixture: '/data/task.json' });
        cy.intercept('GET', '/users/user-id-1/tasks/task-id-1/annotations**', []);
        cy.intercept('GET', 'http://dummy-url.com/image', { fixture: '/assets/annotation-image-1' });

        cy.fixture('/data/jobs.json').then(jobs => {
            cy.stub({ useParams }, 'useParams').callsFake(() => ({ teamId: jobs[0].teamId }));
        });

        cy.fixture('/auth/whoami.json').then(whoami => {
            cy.stub(authProvider, 'getRedirectionBySession').callsFake(() =>
                Promise.resolve(`/teams/${whoami?.user?.team?.id}/jobs`)
            );
        });

        cy.mount(<App />);

        cy.dataCy(HOME_BEGIN_BUTTON).click();

        cy.contains('Liste des jobs');
        cy.contains('Test Task 1');

        cy.dataCy(TOP_BACK_BUTTON).click();

        cy.contains(
            "Notre application de labellisation est conçue pour simplifier le processus d'annotation d'images."
        );

        cy.dataCy(HOME_BEGIN_BUTTON).click();
        cy.dataCy(JOB_ITEM_1).click();

        cy.contains("Pas encore d'annotation effectuée.");

        cy.dataCy(TOP_BACK_BUTTON).click();

        cy.contains('Liste des jobs');
        cy.contains('Test Task 2');

        cy.dataCy(TOP_BACK_BUTTON).click();
        cy.contains(
            "Notre application de labellisation est conçue pour simplifier le processus d'annotation d'images."
        );
    });

    it('Should test back button for the admin.', () => {
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

        cy.dataCy(TOP_BACK_BUTTON).click();

        cy.contains(
            "Notre application de labellisation est conçue pour simplifier le processus d'annotation d'images."
        );

        cy.dataCy(HOME_BEGIN_BUTTON).click();
        cy.dataCy(JOB_ITEM_1).click();

        cy.contains('ROOF');
        cy.contains("Versions de l'annotation");
        cy.contains('x :');
        cy.contains('y :');

        cy.dataCy(TOP_BACK_BUTTON).click();

        cy.contains('Liste des jobs');
        cy.contains('Test Task 2');

        cy.dataCy(TOP_BACK_BUTTON).click();
        cy.contains(
            "Notre application de labellisation est conçue pour simplifier le processus d'annotation d'images."
        );
    });
});
