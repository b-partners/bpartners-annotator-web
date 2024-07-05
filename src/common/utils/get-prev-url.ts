const teamJobListUrlPattern = /teams\/[^/]*\/jobs$/;
const teamTaskBoardUrlPattern = /teams\/[^/]*\/jobs\/[^/]*$/;

const adminJobListUrlPattern = /jobs[^/]*$/;
const adminTaskBoardUrlPattern = /jobs\/[^/]*\/tasks\/review[^/]*$/;

const teamIdPattern = /teams\/([^/]*)\/jobs/;

export const getPrevUrl = () => {
    if (!window) return '/';
    const { href } = window.location;

    if (href.includes('login') || teamJobListUrlPattern.test(href) || adminJobListUrlPattern.test(href)) {
        return '/';
    }

    if (teamTaskBoardUrlPattern.test(href)) {
        const teamIdMatchResult = href.match(teamIdPattern) || [];
        return `/teams/${teamIdMatchResult ? teamIdMatchResult[1] : ''}/jobs`;
    }

    if (adminTaskBoardUrlPattern.test(href)) {
        return '/jobs';
    }

    return '/';
};
