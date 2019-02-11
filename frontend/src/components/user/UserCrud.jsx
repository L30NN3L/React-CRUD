import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Pessoas',
    subtitle: 'Cadastro de pessoas: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/users'
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

export default class UserCrud extends Component {
    
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user} )
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'

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

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter( u => u.id !== user.id )
        if(add) list.unshift(user)
        return list
    }
    
    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })

    }

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

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user,false)
            this.setState({ list })
        })
    }

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

