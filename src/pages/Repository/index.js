// import React from 'react'

// export default function Repository( { match }) {
//   return (
//     <h1>Repository: {decodeURIComponent(match.params.repository)} </h1> 
//   )
// }

//S>----------------------------------------------------------------------------------------<//

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from '../../services/api'

import Container from '../../components/Container'
import { Loading, Owner, IssueList, Select, ControlPage, ButPrev, ButNext } from './styles'

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  }

  state = {
    repository: {},
    statusRepo: 'all',
    issues: [],
    loading: true,
    page: 1,
  }

  async componentDidMount(){
    const { statusRepo, page } = this.state
    const { match } = this.props

    const repoName = decodeURIComponent(match.params.repository)
    
    console.log(repoName)

    // const response = await api.get(`/repos/${repoName}`)
    // const issues = await api.get(`/repos/${repoName}/issues`)

    const [ repository, issues ] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          // state: 'open',
          state: statusRepo,
          per_page: 5,
          page: page
        },
      }),
    ])
    // console.log(repository)
    // console.log(issues)

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    })

  }

  async componentDidUpdate(_, prevState) {
    const { statusRepo, page } = this.state
    
    const { match } = this.props
    const repoName = decodeURIComponent(match.params.repository)    
    
    if(prevState.statusRepo !== statusRepo || prevState.page !== page){

      // this.setState({
      //   loading: true,
      // }) 

      const issues  = await api.get(`/repos/${repoName}/issues`, {
          params: {
            // state: 'open',
            state: statusRepo,
            per_page: 5,
            page: page
          },
        })

      this.setState({
        issues: issues.data,
        // loading: false,
        // statusRepo
      }) 
    }
  }


  handleInputChangeOptions = e => {
    // console.log(e.target.value)
    this.setState(
      { 
        statusRepo: e.target.value, 
        page: 1,
      })
  }

  subtract = () => {
    this.setState({
      page: this.state.page - 1
    })
  }

  add = () => {
    this.setState({
      page: this.state.page + 1
    })
  }

  render(){
    const { repository, issues, loading, statusRepo, page } = this.state

    if(loading){
      return <Loading>Carregando</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Select
            onChange={this.handleInputChangeOptions}
            required
            defaultValue={statusRepo}
          >
            <option value="all">todos</option>
            <option value="open">abertos</option>
            <option value="closed">fechados</option>
          </Select>  

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login}/>
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <ControlPage>
          <ButPrev page={page} type='button' onClick={this.subtract}>Anterior</ButPrev>
          <span>Pagina {page}</span>
          <ButNext type='button' onClick={this.add}>Próxima</ButNext>
        </ControlPage>

      </Container> 
    )

  }
}


