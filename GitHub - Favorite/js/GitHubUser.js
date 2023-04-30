export class GitHubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`
        // estou pegando uma API pública do github

        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers}) => (
            {
                login,
                name,
                public_repos,
                followers
            }
        ))
        // desestruturei o data transformando em um objeto

        /* fetch é uma promessa de busca de dados, criando um data
        com o retorno seguinte */
    }
}
