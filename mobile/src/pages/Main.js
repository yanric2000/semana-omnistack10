import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

// Propriedade padrao para todas as rotas
function Main({ navigation }) {

    const [currentRegion, setCurrentRegion] = useState(null);

    // Função para retornar a posição do usuário
    useEffect( () => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync();
            
            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }
        
        loadInitialPosition();
    }, []);

    const [techSearch, setTechSearch] = useState('');

    const [devs, setDevs] = useState([]);

    async function loadDevs(){
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: techSearch
            }
        });

        setDevs(response.data.devs);
    }

    function handleRegionChange(region){
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return (
        <>
            <MapView
                onRegionChangeComplete={handleRegionChange}
                initialRegion={ currentRegion }
                style={ Styles.map }>
                { devs.map( dev => (
                    <Marker
                        key={dev._id}
                        coordinate={{
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1],
                        }}>
                        <Image 
                            style={ Styles.avatar }
                            source={{ uri: dev.avatar_url }}
                        />
                        <Callout onPress={ () => {
                            // Navegação
                            navigation.navigate('Profile', { github_username: dev.github_username })
                        }}>
                            <View style={ Styles.paddingBorder }>
                                <View style={ Styles.callout }>
                                    <Text style={ Styles.devName }>{ dev.name } </Text>
                                    <Text style={ Styles.devBio }>{ dev.bio }</Text>
                                    <Text style={ Styles.devTechs }>{ dev.techs.join(', ') }</Text>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                )) }
            </MapView>

            <View style={ Styles.searchForm } behavior="position" enabled>
                <TextInput 
                    style={ Styles.searchInput }
                    placeholder="Buscar devs por techs"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techSearch}
                    onChangeText={ (text) => { setTechSearch(text) } }
                />
                <TouchableOpacity onPress={ loadDevs } style={ Styles.loadButton }>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const Styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    avatar: {
        borderColor: '#FFF',
        borderRadius: 4,
        borderWidth: 4,
        height: 54,
        width: 54,
    },

    paddingBorder: {
        padding: 10,
    },

    callout: {
        borderRadius: 8,
        flex: 1,
        height: '100%',
        width: 260,
    },

    devName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    devBio: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },

    devTechs: {
        fontSize: 14,
        marginTop: 5,
    },

    searchForm: {
        flex: 1,
        top: 20,
        left: 20,
        position: 'absolute',
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },

    searchInput: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        color: '#333',
        flex: 1,
        fontSize: 16,
        height: 50,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        elevation: 2,
    },

    loadButton: {
        alignItems: 'center',
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        marginLeft: 16,
        width: 50,
    }
});

export default Main;