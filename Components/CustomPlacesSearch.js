import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { GOOGLE_API_KEY } from '../Constants';
import { getCurrentLocation } from '../Services/Utils';
import Toast from 'react-native-root-toast';
import SearchDropdown from './SearchDropdown';
import { data } from './data';

const CustomPlacesSearch = () => {
	const [query, setQuery] = useState('');
	const [places, setPlaces] = useState([]);
	const [location, setLocation] = useState(null);

	useEffect(() => {
		getCurrentLocation().then(res => {
			console.log(res);
			setLocation(res);
		}).catch(message => {
			Toast.show(message, Toast.durations.SHORT);
		})
	}, []);

	const handleSearch = async (text) => {
		try {
			const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${location.latitude},${location.longitude}&radius=5000&keyword=${text}`);
			const data = await response.json();
			console.log(data.results);
			setPlaces(data.results);
		} catch (error) {
			console.error('Error fetching places:', error);
		}
	};

	return (
		<View>
			{/* <TextInput
				placeholder="Search for places..."
				value={query}
				onChangeText={(text) => setQuery(text)}
			/>
			<Button title="Search" onPress={handleSearch} /> */}
			{/* {places.length > 0 && (
				<View>
					{places.map((place) => (
						<Text key={place.place_id}>{place.name}</Text>
					))}
				</View>
			)} */}
			<SearchDropdown data={data.results} handleSearch/> 
		</View>
	);
};

export default CustomPlacesSearch;