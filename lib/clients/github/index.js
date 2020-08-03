const fs = require('fs');
const axios = require('axios');

module.exports = async () => {
  const GH_CREADENTIAL_PATH = `${process.cwd()}/credentials/gh-token`
  const limit = 100;
  const TOKEN = await fs.promises.readFile(GH_CREADENTIAL_PATH, 'utf8');
  
  const getRepos = async (page) => {
    const { data } = await axios({
      method: 'get',
      url: `https://api.github.com/orgs/Minutrade/repos?page=${page}&per_page=${limit}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${TOKEN}`
      }
    });

    return data;
  };

  const getRepoTopic = async (repoName) => {
    const { data } = await axios({
      method: 'get',
      url: `https://api.github.com/repos/Minutrade/${repoName}/topics`,
      headers: {
        'Accept': 'application/vnd.github.mercy-preview+json',
        'Authorization': `token ${TOKEN}`
      }
    });
    return data;
  };

  const getAllRepos = async () => {
    let page = 0;
    let data = [];
    let repos = []

    do {
      page++;
      data = await getRepos(page);

      if (data.length > 0) {
        repos = repos.concat(await Promise.all(data.map(async d => {
          const topics = await getRepoTopic(d.name)
          return {
            name: d.name,
            private: d.private,
            archived: d.archived,
            disabled: d.disabled,
            topics: topics.names.join()
          }
        })));
      }
    } while (data.length === limit);

    return repos;
  }

  return {
    getAllRepos
  }
};
