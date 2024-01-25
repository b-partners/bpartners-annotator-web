import { Auth } from 'aws-amplify';
import App from '../App';
import { FieldErrorMessage } from '../common/resolvers';
import { authProvider } from '../providers';

const HOME_BEGIN_BUTTON = 'start-button';
const USERNAME_INPUT = 'username-input';
const PASSWORD_INPUT = 'password-input';
const SUBMIT = "button[type='submit']";
const NEW_PASSWORD_INPUT = PASSWORD_INPUT;
const NEW_PASSWORD_CONFIRMATION_INPUT = 'confirmedPassword-input';

const EXPECTED_HOME_TEXT = `Notre application de labellisation est conçue pour simplifier le processus d'annotation d'images.`;
const EXPECTED_TEXT_ON_LOGIN = 'Connection';
const EXPECTED_TEXT_AFTER_LOGIN = 'Nouveau mot de passe';

describe('Test Login component', () => {
    it('Should test login', () => {
        cy.mount(<App />);
        cy.contains(EXPECTED_HOME_TEXT);
        cy.dataCy(HOME_BEGIN_BUTTON).click();

        cy.contains(EXPECTED_TEXT_ON_LOGIN);

        cy.typeEnter(USERNAME_INPUT);
        cy.contains(FieldErrorMessage.required);

        const invalidEmailAddress = 'dummy email address';
        cy.typeEnter(USERNAME_INPUT, invalidEmailAddress);
        cy.contains(FieldErrorMessage.invalidEmail);

        const validEmailAddress = 'dummy@gmail.com';
        cy.typeEnter(USERNAME_INPUT, validEmailAddress);
        cy.should('not.contain', FieldErrorMessage.invalidEmail);

        cy.typeEnter(PASSWORD_INPUT);
        cy.contains(FieldErrorMessage.required);

        const validPassword = 'dummyPASSWORD$1';
        cy.dataCy(PASSWORD_INPUT).type(validPassword);

        cy.fixture('auth/user.json').then(user => {
            cy.stub(Auth, 'signIn').callsFake(() => {
                return user;
            });
        });

        cy.get(SUBMIT).click();

        cy.contains(EXPECTED_TEXT_AFTER_LOGIN);

        const tooShortPassword = 'd';
        cy.typeEnter(NEW_PASSWORD_INPUT, tooShortPassword);
        cy.contains(FieldErrorMessage.minPassword);

        const invalidPassword = 'dummyPassword';
        cy.typeEnter(NEW_PASSWORD_INPUT, invalidPassword);
        cy.contains(FieldErrorMessage.badPassword.slice(0, 10));

        cy.typeEnter(NEW_PASSWORD_INPUT, validPassword);
        cy.should('not.contain', FieldErrorMessage.badPassword.slice(0, 10));

        cy.typeEnter(NEW_PASSWORD_CONFIRMATION_INPUT, invalidPassword);
        cy.contains(FieldErrorMessage.notMatchingPassword);

        cy.typeEnter(NEW_PASSWORD_CONFIRMATION_INPUT, validPassword);
        cy.should('not.contain', FieldErrorMessage.notMatchingPassword);

        cy.stub(authProvider, 'updatePassword').callsFake(() => '');
    });
});
