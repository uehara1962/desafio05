// import React from 'react'
// import { Title } from './styles'
// export default function Main () {
//   return (
//     <Title error={false}>Main</Title> 
//   )
// }

//S>----------------------------------------------------------------------------------------<//

// import React from 'react'
// import { FaGithubAlt, FaPlus } from 'react-icons/fa'
// import { Container, Form, SubmitButton} from './styles'


// export default function Main () {
//   return (
//     <Container>
//       <h1>
//         <FaGithubAlt />
//         Repositorios
//       </h1>
//       <Form onSubmit={() => {}}>
//         <input 
//           type="text"
//           placeholder="Adicionar repositório"
//         />
//         <SubmitButton disable>
//           <FaPlus color="#FFF" size={14} />
//         </SubmitButton>
//       </Form>
//     </Container> 
//   )
// }

//S>----------------------------------------------------------------------------------------<//

// import React, { Component } from 'react'
// import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
// import { Link } from 'react-router-dom'

// import api from '../../services/api'

// import { Container, Form, SubmitButton, List} from './styles'


// export default class Main extends Component {
//   state = {
//     newRepo: '',
//     repositories: [],
//     loading: false,
//   }  

//   // Carregar os dados do localStorage
//   componentDidMount(){
//     const repositories = localStorage.getItem('repositories')

//     if(repositories){
//       this.setState({ repositories: JSON.parse(repositories)})
//     }
//   }

//   // Salvar os dados do localStorage
//   componentDidUpdate(_, prevState){
//     const { repositories } = this.state
    
//     if (prevState.respositories !== repositories){
//       localStorage.setItem('repositories', JSON.stringify(repositories))
//     }
  
//   }



//   handleInputChange = e => {
//     this.setState({ newRepo: e.target.value })
//   }

//   handleSubmit = async e => {
//     const { newRepo, repositories } = this.state
//     e.preventDefault()

//     this.setState({ loading: true })
    
//     const response = await api.get(`/repos/${newRepo}`)
    
//     // console.log(response.data)
//     const data = {
//       name: response.data.full_name,
//     }

//     this.setState({
//       repositories: [...repositories, data],
//       newRepo: '',
//       loading: false,
//     })
//   }


//   render(){
//     const { newRepo, repositories, loading } = this.state

//     return (
//       <Container>
//         <h1>
//           <FaGithubAlt />
//           Repositorios
//         </h1>
//         <Form onSubmit={this.handleSubmit}>
//           <input 
//             type="text"
//             placeholder="Adicionar repositório"
//             value={newRepo}
//             onChange= {this.handleInputChange}
//           />
//           <SubmitButton loading={loading}>
//             { loading ? <FaSpinner color="#FFF" size={14} /> :
//               <FaPlus color="#FFF" size={14} />
//             }
//           </SubmitButton>
//         </Form>
//         <List >
//             {repositories.map(repository => (
//               <li key={repository.name}>
//                 <span>{repository.name}</span>
//                 {/* <Link to="/repository">Detalhes</Link> */}
//                 <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
//               </li>
//             ))}
//         </List>
//       </Container> 
//     )

//   }
// }

//S>----------------------------------------------------------------------------------------<//

/*
--I> Separado o Container e importado a partir de um arquivo
*/
import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import Container from '../../components/Container'

import { Form, SubmitButton, List} from './styles'


export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }  

  // Carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories')

    if(repositories){
      this.setState({ repositories: JSON.parse(repositories)})
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState){
    const { repositories } = this.state
    
    if (prevState.respositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  
  }



  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    const { newRepo, repositories } = this.state
    e.preventDefault()

    this.setState({ loading: true })
    
    try{
      const response = await api.get(`/repos/${newRepo}`)
      // console.log(response.data)
      const data = {
        name: response.data.full_name,
      }
  
      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      })


    }catch(err){
      console.log('error:', err)
    }



    
  }


  render(){
    const { newRepo, repositories, loading } = this.state

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input 
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange= {this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            { loading ? <FaSpinner color="#FFF" size={14} /> :
              <FaPlus color="#FFF" size={14} />
            }
          </SubmitButton>
        </Form>
        <List >
            {repositories.map(repository => (
              <li key={repository.name}>
                <span>{repository.name}</span>
                {/* <Link to="/repository">Detalhes</Link> */}
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
              </li>
            ))}
        </List>
      </Container> 
    )

  }
}
