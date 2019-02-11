import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Pessoas',
    subtitle: 'Cadastro de pessoas: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/users' // endereço de onde API Rest FAKE se hospeda
const initialState = {
    user: { name: '', 
            phone: '',
            street: '',
            number: 0,
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            dateInsertion: '' },
    list: []
}


// Classe responsável por toda as funcionalidades do CRUD
export default class UserCrud extends Component {
    
    state = { ...initialState }

    // Quando o componente é renderizado, a consulta geral de pessoas é feita e a lista é preenchida
    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    // função de limpar formulário
    clear() {
        this.setState({ user: initialState.user} )
    }

    // Função de inserção de dados do formulário
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'

        // Se for inserção e não atualização, é inserido junto a data de criação
        if(method === 'post') {
           let date = new Date();
           date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
           user.dateInsertion = date;
        }

        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    // Função que atualiza a lista quando houver inserção ou edição de dados
    getUpdatedList(user, add = true) {
        const list = this.state.list.filter( u => u.id !== user.id )
        if(add) list.unshift(user)
        return list
    }
    
    // Função que modifica todos os dados do estado da classe
    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })

    }

    // Formulário do Sistema
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digit o nome..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control"
                                name="phone"
                                value={this.state.user.phone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o telefone..." />
                        </div>
                    </div>

                </div>

                <div className="row">
                    
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Rua</label>
                            <input type="text" className="form-control"
                                name="street"
                                value={this.state.user.street}
                                onChange={e => this.updateField(e)}
                                placeholder="Digit a rua..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Número</label>
                            <input type="number" className="form-control"
                                name="number"
                                value={this.state.user.number}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o número..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Complemento</label>
                            <input type="text" className="form-control"
                                name="complement"
                                value={this.state.user.complement}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o complemento..." />
                        </div>
                    </div>

                </div>

                <div className="row">
                    
                    <div className="col-12 col-md-5">
                        <div className="form-group">
                            <label>Bairro</label>
                            <input type="text" className="form-control"
                                name="neighborhood"
                                value={this.state.user.neighborhood}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o bairro..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-5">
                        <div className="form-group">
                            <label>Cidade</label>
                            <input type="text" className="form-control"
                                name="city"
                                value={this.state.user.city}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a cidade..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Estado</label>
                            <input type="text" className="form-control"
                                name="state"
                                value={this.state.user.state}
                                onChange={e => this.updateField(e)}
                                placeholder="" />
                        </div>
                    </div>

                </div>

                <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btm-primary"
                                onClick={e => this.save(e)}>
                                Salvar
                            </button>

                            <button className="btn btn-secondary ml-2"
                                onClick={e => this.clear(e)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
            </div>
        )
    }

    // Função que é utilizada para Edição
    load(user) {
        this.setState({ user })
    }

    // Função que é utilizada para Deletar
    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user,false)
            this.setState({ list })
        })
    }

    // Tabela do Sistema
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Data de Cadastro</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    // Modo de apresentação de dados para cada linha da Tabela
    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.dateInsertion}</td>
                    <td>{user.name}</td>
                    <td>{`${user.street} ${user.number} ${user.complement} ${user.neighborhood} ${user.city} ${user.state}`}</td>
                    <td>{user.phone}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}

