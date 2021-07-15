import React from 'react';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import { ProfileRelations } from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

function ProfileSidebar(propriedades) {
  console.log("propreidades", propriedades)
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home() {
  const githubUser = 'WildBaconDev';
  
  const [comunidades, setComunidades] = React.useState([]);
  // {
  //   id: new Date().toISOString(),
  //   title: "Eu odeio acordar cedo",
  //   image: "https://alurakut.vercel.app/capa-comunidade-01.jpg"
  // }
  
  const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobruno', 'felipefialho'];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta.map(obj => {
          return {
            id: obj.login + new Date().toISOString(), 
            image: `https://github.com/${obj.login}.png`,
            title: obj.login,
            link: `https://github.com/${obj.login}`
          }
        }));
    })

    // API GraphQL
    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: {
        'Authorization': '0bda82399aa0fb93241997b98d4cb2',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `{
          allCommunities {
            id
            imageUrl
            title
            link
            creatorSlug
          }
        }`
      })
    })
    .then((respostaDoServidor) => respostaDoServidor.json())
    .then((response) => {
      setComunidades(response.data.allCommunities);
    })
  }, []);


  return (
    <>
      <AlurakutMenu githubUser={githubUser}></AlurakutMenu>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();

              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image') ? dadosDoForm.get('image') : 'https://picsum.photos/200/300',
                link: dadosDoForm.get('link') ? dadosDoForm.get('link') : 'https://www.alura.com.br/stars',
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                setComunidades([...comunidades, dados.registroCriado])
              })
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de Link" 
                  name="link" 
                  aria-label="Coloque uma URL para usarmos de Link"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelations titulo="Seguidores" lista={seguidores}></ProfileRelations>
          <ProfileRelations titulo="Comunidades" lista={comunidades}></ProfileRelations>
          <ProfileRelations titulo="Pessoas da comunidade" lista={pessoasFavoritas}></ProfileRelations>
        </div>
      </MainGrid>
    </>
  )
}
