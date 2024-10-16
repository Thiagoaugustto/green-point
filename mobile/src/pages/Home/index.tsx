import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

type RootStackParamList = {
  Points: { 
    uf: string; 
    city: string 
  };
};

type PointsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Points'
>;

type Props = {
  navigation: PointsScreenNavigationProp;
};

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
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

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        style={styles.container}
      >
        <View style={styles.main}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')} 
            resizeMode="contain"
          />
          <View>
            <Text style={styles.title}>Seu guia para coleta de resíduos sustentável</Text>
            <Text style={styles.description}>Conectamos pessoas a soluções de coleta de resíduos de forma rápida e simples.</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
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
              backgroundColor: '#FFF'
            }}
          />

          { selectedUf !== '' && (
            <>
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
                  backgroundColor: '#FFF'
                }}
              />
            </>
          )}

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <Text style={styles.buttonText}>
              Pesquisar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#FFF',
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  label: {
    color: '#6C6C80',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 30,
    backgroundColor: '#FFF'
  },

  footer: {},

  select: {},

  button: {
    backgroundColor: '#0ea754',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
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

export default Home;