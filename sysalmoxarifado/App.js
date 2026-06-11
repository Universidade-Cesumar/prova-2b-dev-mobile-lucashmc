import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'https://6a2b3460b687a7d5cbc4f1e7.mockapi.io/insumos';

export default function App() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nomeMaterial, setNomeMaterial] = useState('');
  const [quantidadeMaterial, setQuantidadeMaterial] = useState('');
  const [categoriaMaterial, setCategoriaMaterial] = useState('');

  const adicionarMaterial = async () => {
    const nome = nomeMaterial.trim();

    if (!nome) {
      setError('Informe o nome do material antes de adicionar.');
      return;
    }

    const novoMaterial = {
      nome,
      quantidade: Number(quantidadeMaterial) || 0,
      categoria: categoriaMaterial.trim() || 'Sem categoria',
    };

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoMaterial),
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar o material no mock API.');
      }

      const materialSalvo = await resposta.json();

      setInsumos((listaAtual) => [materialSalvo, ...listaAtual]);
      setNomeMaterial('');
      setQuantidadeMaterial('');
      setCategoriaMaterial('');
      setError('');
    } catch (erro) {
      setError('Não foi possível salvar o material no mock API.');
    }
  };

  useEffect(() => {
    const carregarInsumos = async () => {
      try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error('Falha ao carregar os insumos.');
        }

        const dados = await resposta.json();
        setInsumos(dados);
      } catch (erro) {
        setError('Não foi possível carregar os insumos da API.');
      } finally {
        setLoading(false);
      }
    };

    carregarInsumos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Almoxarifado</Text>
        <Text style={styles.subtitle}>Insumos carregados da API</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}></Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do material"
            value={nomeMaterial}
            onChangeText={setNomeMaterial}
            testID="input-nome"
          />

          <Text style={[styles.label, styles.spacing]}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a quantidade"
            keyboardType="numeric"
            value={quantidadeMaterial}
            onChangeText={setQuantidadeMaterial}
            testID="input-quantidade"
          />

          <Text style={[styles.label, styles.spacing]}>Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a categoria"
            value={categoriaMaterial}
            onChangeText={setCategoriaMaterial}
            testID="input-categoria"
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Adicionar material"
              onPress={adicionarMaterial}
              testID="btn-cadastrar"
              accessibilityLabel="Cadastrar material"
            />
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.message}>Carregando insumos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={insumos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome || 'Insumo'}</Text>
              <Text style={styles.cardText}>Quantidade: {item.quantidade ?? '-'}</Text>
              <Text style={styles.cardText}>Categoria: {item.categoria ?? 'Sem categoria'}</Text>
            </View>
          )}
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  formCard: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  spacing: {
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 12,
    color: '#374151',
    fontSize: 14,
  },
  error: {
    color: '#b91c1c',
    textAlign: 'center',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#4b5563',
  },
});
