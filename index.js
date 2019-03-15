/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on([
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.synchronize'
  ], setStatus.bind(null, app))

  function setStatus (app, context) {
    newStatus = {
      wip: false,
      match: '🚧'
    }
  const pullRequest = context.payload.pull_request

  const checkOptions = {
    name: 'age-before-merge',
    head_branch: '', // workaround for https://github.com/octokit/rest.js/issues/874
    head_sha: pullRequest.head.sha,
    status: 'in_progress',
    started_at: new Date(),
    output: {
      title: `Title contains ${newStatus.match === '🚧' ? 'a construction emoji' : `"${newStatus.match}"`}`,
      summary: `The title "${pullRequest.title}" contains "${newStatus.match}".`,
      text: `By default, WIP only checks the pull request title for the terms "WIP", "Work in progress" and "🚧".
You can configure both the terms and the location that the WIP app will look for by signing up for the pro plan: https://github.com/marketplace/wip. All revenue will be donated to [Rails Girls Summer of Code](https://railsgirlssummerofcode.org/).`
    }
  }

  context.github.checks.create(context.repo(checkOptions))

  var now = new Date().getTime();
  var millisecondsToWait = 10000;
  while ( new Date().getTime() < now + millisecondsToWait )
  {
  /* do nothing; this will exit once it reached the time limit */
  /* if you want you could do something and exit*/
  /* mostly I prefer to use this */
  }

  if (!newStatus.wip) {
    checkOptions.status = 'completed'
    checkOptions.conclusion = 'success'
    checkOptions.completed_at = new Date()
    checkOptions.output.title = 'Ready for review'
    checkOptions.output.summary = 'No match found based on configuration'
  }

  console.log("I got here!")

  return context.github.checks.create(context.repo(checkOptions))
}

    // we wanna block merging, then wait five days, then allow merging
    // also wanna make sure *the PR itself* has been open for at least five days
  }
