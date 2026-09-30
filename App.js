import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

export default function App() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [ordem, setOrdem] = useState('AZ');
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    carregarPersonagens();
  }, []);

  async function carregarPersonagens() {
    try {
      setCarregando(true);
      setErro('');

      const resposta = await fetch(
        'https://rickandmortyapi.com/api/character'
      );

      if (!resposta.ok) {
        throw new Error('Erro ao consultar a API');
      }

      const dados = await resposta.json();

      setPersonagens(dados.results);
    } catch (erro) {
      setErro('Não foi possível carregar os personagens.');
      console.log(erro);
    } finally {
      setCarregando(false);
    }
  }

  const personagensFiltrados = personagens
    .filter((personagem) =>
      personagem.name
        .toLowerCase()
        .includes(pesquisa.toLowerCase())
    )
    .filter((personagem) => {
      if (statusFiltro === 'Todos') {
        return true;
      }

      return personagem.status === statusFiltro;
    })
    .sort((a, b) => {
      if (ordem === 'AZ') {
        return a.name.localeCompare(b.name);
      }

      return b.name.localeCompare(a.name);
    });

  function selecionarPersonagem(personagem) {
    setSelecionado(personagem);
  }

  function limparSelecao() {
    setSelecionado(null);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => selecionarPersonagem(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.imagem}
        />

        <View style={styles.informacoes}>
          <Text style={styles.nome}>{item.name}</Text>

          <Text style={styles.info}>
            Status: {item.status}
          </Text>

          <Text style={styles.info}>
            Espécie: {item.species}
          </Text>

          <Text style={styles.info}>
            Gênero: {item.gender}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" />

        <Text style={styles.loading}>
          Carregando personagens...
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erro}>{erro}</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={carregarPersonagens}
        >
          <Text style={styles.textoBotao}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Rick and Morty
      </Text>

      <Text style={styles.subtitulo}>
        Lista de personagens
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar personagem..."
        placeholderTextColor="#777"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <View style={styles.filtros}>

        <TouchableOpacity
          style={[
            styles.filtroBotao,
            statusFiltro === 'Todos' && styles.filtroSelecionado
          ]}
          onPress={() => setStatusFiltro('Todos')}
        >
          <Text
            style={
              statusFiltro === 'Todos'
                ? styles.textoFiltroSelecionado
                : styles.textoFiltro
            }
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filtroBotao,
            statusFiltro === 'Alive' && styles.filtroSelecionado
          ]}
          onPress={() => setStatusFiltro('Alive')}
        >
          <Text
            style={
              statusFiltro === 'Alive'
                ? styles.textoFiltroSelecionado
                : styles.textoFiltro
            }
          >
            Vivos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filtroBotao,
            statusFiltro === 'Dead' && styles.filtroSelecionado
          ]}
          onPress={() => setStatusFiltro('Dead')}
        >
          <Text
            style={
              statusFiltro === 'Dead'
                ? styles.textoFiltroSelecionado
                : styles.textoFiltro
            }
          >
            Mortos
          </Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.ordemBotao}
        onPress={() =>
          setOrdem(ordem === 'AZ' ? 'ZA' : 'AZ')
        }
      >
        <Text style={styles.textoBotao}>
          Ordenação:{' '}
          {ordem === 'AZ' ? 'A → Z' : 'Z → A'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.contador}>
        Resultados encontrados: {personagensFiltrados.length}
      </Text>

      <FlatList
        data={personagensFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      />

      {selecionado && (
        <View style={styles.painel}>

          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={styles.tituloDetalhes}>
              Detalhes do personagem
            </Text>

            <Image
              source={{ uri: selecionado.image }}
              style={styles.imagemDetalhes}
            />

            <Text style={styles.detalhe}>
              Nome: {selecionado.name}
            </Text>

            <Text style={styles.detalhe}>
              ID: {selecionado.id}
            </Text>

            <Text style={styles.detalhe}>
              Status: {selecionado.status}
            </Text>

            <Text style={styles.detalhe}>
              Espécie: {selecionado.species}
            </Text>

            <Text style={styles.detalhe}>
              Gênero: {selecionado.gender}
            </Text>

            <Text style={styles.detalhe}>
              Origem: {selecionado.origin.name}
            </Text>

            <Text style={styles.detalhe}>
              Localização: {selecionado.location.name}
            </Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={limparSelecao}
            >
              <Text style={styles.textoBotao}>
                Fechar detalhes
              </Text>
            </TouchableOpacity>

          </ScrollView>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    paddingTop: 55,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 18,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    fontSize: 16,
  },

  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  filtroBotao: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  filtroSelecionado: {
    backgroundColor: '#333',
    borderColor: '#333',
  },

  textoFiltro: {
    color: '#333',
    fontWeight: '600',
  },

  textoFiltroSelecionado: {
    color: '#fff',
    fontWeight: 'bold',
  },

  ordemBotao: {
    padding: 13,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  contador: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },

  lista: {
    paddingBottom: 20,
  },

  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 2,
  },

  imagem: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  informacoes: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  info: {
    marginBottom: 3,
    color: '#555',
  },

  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loading: {
    marginTop: 12,
    fontSize: 16,
  },

  erro: {
    fontSize: 17,
    marginBottom: 15,
    textAlign: 'center',
  },

  botao: {
    backgroundColor: '#333',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  painel: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    top: 100,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 8,
  },

  tituloDetalhes: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  imagemDetalhes: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    borderRadius: 18,
    marginBottom: 20,
  },

  detalhe: {
    fontSize: 17,
    marginBottom: 10,
    color: '#333',
  },

});
