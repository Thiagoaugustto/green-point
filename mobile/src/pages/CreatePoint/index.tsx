import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import api from "../../services/api";
import axios from 'axios';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
          </TouchableOpacity>

          <Text style={styles.title}>Cadastro de ponto de coleta</Text>
          <Text style={styles.description}>Preencha as informações abaixo para cadastrar um novo ponto de coleta.</Text>

          <Text style={styles.label}>Nome da entidade</Text>
          <TextInput
            style={styles.input}
            value={''}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={() => {}}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={''}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={() => {}}
          />

          <Text style={styles.label}>Whatsapp</Text>
          <TextInput
            style={styles.input}
            value={''}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={() => {}}
          />

          <Text style={styles.label}>Estado</Text>
          <SelectList 
            setSelected={setSelectedUf} 
            data={ufs} 
            search={false}
            arrowicon={<FontAwesome name="chevron-down" size={15} color={'#34CB79'} />}
            boxStyles={{
              marginBottom: 4,
              height: 60,
              alignItems: 'center',
              backgroundColor: '#f1f1f1'
            }}
          />

          <Text style={styles.label}>Cidade</Text>
          <SelectList 
            setSelected={setSelectedCity} 
            data={cities}
            search={false}
            arrowicon={<FontAwesome name="chevron-down" size={15} color={'#34CB79'} />}
            boxStyles={{
              marginBottom: 8,
              height: 60,
              alignItems: 'center',
              backgroundColor: '#f1f1f1'
            }}
          />

          <Text style={styles.label}>Selecione o endereço no mapa</Text>

          <View style={styles.mapContainer}>
            <MapView 
              style={styles.map} 
              initialRegion={{
                latitude: -7.0855285,
                longitude: -34.8377519,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
            </MapView>
          </View>

          <Text style={styles.label}>Selecione um ou mais ítens abaixo</Text>

          <View style={styles.itemsContainer}>
            <ScrollView
              horizontal 
              showsHorizontalScrollIndicator={false}
            >
              {items.map(item => (
                <TouchableOpacity 
                  key={String(item.id)} 
                  style={styles.item} 
                  onPress={() => {}}
                  activeOpacity={0.6}
                >
                  <SvgUri width={42} height={42} uri={item.image_url} />
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <RectButton style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>
              Cadastrar
            </Text>
          </RectButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 15,
  },

  title: {
    color: '#322153',
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 24,
  },

  input: {
    height: 60,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
    fontSize: 16,
    borderColor: '#808080',
    borderWidth: 1,
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
    height: 300
  },

  map: {
    width: '100%',
    height: '100%',
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32
  },

  item: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#f9f9f9',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },

  label: {
    color: '#6C6C80',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginTop: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#0ea754',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default CreatePoint;