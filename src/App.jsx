import { useState } from 'react'
import './App.css'

function App() {
  const [busca, setBusca] = useState('')
  const [lista, setLista] = useState([])
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  const buscarFilmes = async () => {
      if (!busca.trim()) return

      setLoading(true)
      setErro(null)
      setDados(null)

      try {
            const res = await fetch(
                    `https://imdb.iamidiotareyoutoo.com/search?q=${busca}`
                  )
            const data = await res.json()

            if (!data.description) {
                    throw new Error('Nenhum resultado encontrado')
                  }

              setLista(data.description)
            } catch (err) {
                  setErro(err.message || 'Erro ao buscar filmes')
                  setLista([])
                } finally {
                      setLoading(false)
                    }
      }

    const buscarDados = (item) => {
        setDados(item)
      }

    return (
        <div className="container">
          <h1>Search</h1>

          {!dados && (
            <>
              <div className="busca">
                <input
                  type="text"
                  placeholder="Search for a movie..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarFilmes()}
                />
                <button onClick={buscarFilmes} disabled={loading}>
                  Buscar
                </button>
              </div>

              <div className="grid">
                {lista.map((item) => (
                  <div
                    key={item['#IMDB_ID']}
                    className="card"
                    onClick={() => buscarDados(item)}
                  >
                    <img
                      src={item['#IMG_POSTER']}
                      alt={item['#TITLE']}
                    />

                    <div className="overlay">
                      <h3>{item['#TITLE']}</h3>
                      <p>{item['#YEAR']}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {dados && (
            <div className="detalhes">
              <button className="voltar" onClick={() => setDados(null)}>
                ⬅ Return
              </button>

              <div className="detalhesCard">
                <img
                  src={dados['#IMG_POSTER']}
                  alt={dados['#TITLE']}
                />

                <div className="infoDetalhes">
                  <h2>{dados['#TITLE']}</h2>

                  <p><strong>📅 Ano:</strong> {dados['#YEAR']}</p>
                  <p><strong>🆔 ID:</strong> {dados['#IMDB_ID']}</p>
                  <p><strong>🧑 AUTOR:</strong> {dados['#ACTORS']}</p>
                  <p><strong>🔗 LINK:</strong> {dados['#IMDB_URL']}</p>

                  <p className="descricao">
                    Este titulo foi encontrado via busca na API IMDb.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && <p className="status">⏳ Loading...</p>}

          {erro && <p className="erro">❌ {erro}</p>}

          {!lista.length && !dados && !loading && !erro && (
                  <p className="status">Digite algo para começar 👆</p>
                )}
        </div>
      )
}

export default App
