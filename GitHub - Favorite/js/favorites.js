import { GitHubUser } from "./GitHubUser.js"

// criar um objeto com o construtor root para chamada de um elemento html

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load() // o load foi chamado para o carregamento
    }

    // função load vai receber o array 

    load() {
        // criação de um array com objetos e suas propriedades

        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

        /* o JSON.parse vai pegar qualquer valor dentro de localstorage,
        que sendo uma string e transformar em um array, objeto... */
    }

    save() {
        // vou pegar o local storage e salvar transformando o objeto em string JSON
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
    // await junto com async é uma promessa assíncrona, igual o fetch
    try {

      const existUser = this.entries.find(entry => entry.login === username)

      if(existUser) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GitHubUser.search(username) 
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries] // ... espalha o array anterior junto com o novo user
      this.update()
      this.save()

    } 

    catch(error) {
        alert(error.message)
    }
}

    /* filter vai verificar dentro do array entries os valores passados,
    se o valor passado for diferente será mantido, se for igual será deletado 
    criando assim um novo array com objeto 5*/

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

// novo objeto que copia todo parâmetro de outro objeto com super
// extends pega o objeto escolhido

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr() 
        
        // para cada entries irá criar um objeto com um novo dado

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isConfirm = confirm('Tem certeza que deseja remover este usuário?')
                if(isConfirm) {
                    this.delete(user)
                }
            }
            
            // append insera um novo conteúdo html com objeto

            this.tbody.append(row)
        })

    }

    createRow() {
        // criar uma variável para criar um html tr

        const tr = document.createElement('tr')

        // innerHTML vai receber todo o conteúdo de criação

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/gabriel-lima258.png" alt="Gabriel's image">
                <a href="https://github.com/gabriel-lima258" target="_blank">
                    <p>Gabriel Lima</p>
                    <span>gabriel-lima258</span>
                </a>
            </td>
            <td class="repositories">
                7
            </td>
            <td class="followers">
                3
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        // por fim retorna o tr

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}