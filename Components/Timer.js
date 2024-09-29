import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../Styles';

const Timer = ({ duration = 60 }) => {
	const [timeLeft, setTimeLeft] = useState(duration); // Start with 60 seconds
	
	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(intervalId);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		// Clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);


	// Format seconds into MM:SS
	const formatTime = (secs) => {
		const minutes = Math.floor(secs / 60);
		const seconds = secs % 60;
		return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	return (
		<View style={styles.container}>
			<Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	timerText: {	
		fontWeight: "bold",
		color: colors.darkGreen
	},
});

export default Timer;