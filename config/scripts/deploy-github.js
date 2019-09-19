const ghpages = require('gh-pages')

// replace with your repo url
ghpages.publish(
  'dist',
  {
    branch: 'master',
    repo: 'git@github.com:TimesheetTracker/TimesheetTracker.github.io',
  },
  () => {
    console.log('Deploy Complete!')
  }
)