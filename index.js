const githubClient = require('./lib/clients/github');
const googleSheetsClient = require('./lib/clients/google-sheets');

(async () => {
  const repos = await (await githubClient()).getAllRepos();

  console.log(`${repos.length} repos founded!`)
  // console.log(repos)

  const cells = repos.map(r => ([ r.name, r.private, r.archived, r.disabled, r.topics ]));
  
  console.log(cells);

  (await googleSheetsClient()).write(cells);
  // const topics = await getRepoTopic('bonuz-web-browserstack')
  // console.log(topics)
})();
