import React, { useState, useRef } from 'react';
import { View, Dimensions, Animated, FlatList, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Carousel = ({ data, renderItem, loop = true }) => {
  const [scrollX] = useState(new Animated.Value(0));
  const carouselRef = useRef(null);

  const handleSnapToItem = (index) => {
    carouselRef.current.scrollToIndex({ index });
  };

  const renderSlide = ({ item, index }) => {
    return renderItem(item, index);
  };

  return (
    <View style={styles.carouselContainer}>
      <Animated.FlatList
        ref={carouselRef}
        data={loop ? [...data, ...data] : data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSlide}
        // scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />
      <View style={styles.indicatorContainer}>
        {/* Add indicator logic here based on data length and current index */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: "row"
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Carousel;