import React, { Component } from "react";
import {
  View,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import { ScreenHeight } from "react-native-elements/dist/helpers";
import { composeDeclarations } from "@shopify/react-native-skia";
import AsyncStorage from '@react-native-async-storage/async-storage';

class Cards extends Component {
  //   cardPosition = new Animated.ValueXY(0);

  constructor(props) {
    super(props);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        this.props.cardPosition.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (Math.abs(gestureState.dx) > 120) {
          if (gestureState.dx > 0) {
            this.swipeRight();
          } else {
            this.swipeLeft();
          }
        } else {
          this.resetCardPosition();
        }
      },
    });
  }

  rotate = this.props.cardPosition.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-08deg", "0deg", "08deg"],
    extrapolate: "clamp",
  });

  rotateAndTranslate = {
    transform: [
      {
        rotate: this.rotate,
      },
      ...this.props.cardPosition.getTranslateTransform(),
    ],
  };

  nextCardOpacity = this.props.cardPosition.x.interpolate({
    inputRange: [0, 0, 0],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  nextCardScale = this.props.cardPosition.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.96, 1],
    extrapolate: "clamp",
  });

  swipeRight = async () => {
    Animated.sequence([
      Animated.timing(this.props.cardPosition, {
        toValue: { x: 600, y: 0 },
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      const newSwipedCard = this.props.cardData;
      try {
        let existingSwipedCards = await AsyncStorage.getItem('swipedCards');
        existingSwipedCards = existingSwipedCards ? JSON.parse(existingSwipedCards) : [];
        
        existingSwipedCards.push(newSwipedCard);
        
        await AsyncStorage.setItem('swipedCards', JSON.stringify(existingSwipedCards));

        // Notify that card is updated
        this.handleAnimationComplete();
      } catch (error) {
        // Handle AsyncStorage errors
        console.error('Error storing swiped card:', error);
      }
    });
  };

  swipeLeft = () => {
    Animated.sequence([
      Animated.timing(this.props.cardPosition, {
        toValue: { x: -600, y: 0 },
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.handleAnimationComplete();
    });
  };

  resetCardPosition = () => {
    Animated.spring(this.props.cardPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  handleAnimationComplete = () => {
    this.setState(this.props.onIncrementIndex(), () => {
      this.props.cardPosition.setValue({ x: 0, y: 0 });
    });
  };

  componentDidMount() {
    this.props.cardmount();
  }

  // Render the card component
  render() {
    // const { currentIndex, currentCard, nextCard, index, uniqueId } = this.props;
    const isCurrentCard = this.props.currentIndex === this.props.index;
    const isNextCard = this.props.currentIndex + 1 === this.props.index;
    const isNextNextCard = this.props.currentIndex + 2 === this.props.index;

    return (
      // <>
      // {this.state.showLoading? <CustomLoading/> : null}
      <View
        {...this.panResponder.panHandlers}
        key={this.props.uniqueId}
        style={{
          zIndex: 100000 - this.props.index,
          alignItems: "center",
          justifyContent: "center",
          // top: 0,
          // left: 0,
          // right: 0,
          bottom: SCREEN_HEIGHT * 0.16,
        }}
      >
        {isCurrentCard && (
          <Animated.View
            style={[
              this.constructor.styles.card,
              this.rotateAndTranslate,
              { opacity: this.currentCardOpacity },
            ]}
          >
            {/* Render content for the current card here */}
            <View style={this.constructor.styles.imageContainer}>
              {this.props.currentCard.photos
                .slice(0, 4)
                .map((photo, photoIndex) => (
                  <Image
                    key={photoIndex}
                    source={{ uri: photo }}
                    style={[
                      this.constructor.styles.cardImage,
                      {
                        height: `${
                          100 / this.props.currentCard.photos.length
                        }%`,
                      },
                    ]}
                  />
                ))}
            </View>
            <View style={this.constructor.styles.textOverlay}>
              <Text style={[this.constructor.styles.cardTitle]}>
                {this.props.currentCard.name}
              </Text>
            
              {/* google maps touchable button */}
              <View style={this.constructor.styles.mapButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    WebBrowser.openBrowserAsync(
                      `https://www.google.com/maps/search/?api=1&query_place_id=${this.props.currentCard.place_id}&query=${this.props.currentCard.geometry.location.lat},${this.props.currentCard.geometry.location.lng}`
                    );
                  }}
                  style={this.constructor.styles.mapIcon}
                >
                  <Image
                    // source={require("../../../assets/png-transparent-google-maps-new-logo-icon-thumbnail.png")}
                    defaultSource={require("../../../assets/image-removebg-preview.png")} //using default source instead solved the flickering on first load 
                    style={this.constructor.styles.mapIcon}
                  />
                  {/* <Text style={this.constructor.styles.buttonText}>Open in Maps</Text> */}
                </TouchableOpacity>
              </View>

            </View>
          </Animated.View>
        )}

        {isNextCard && (
          <Animated.View
            style={[
              this.constructor.styles.card,
              {
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
              },
            ]}
          >
            {/* Render content for the next card here */}
            <View style={this.constructor.styles.imageContainer}>
              {this.props.nextCard.photos
                .slice(0, 4)
                .map((photo, photoIndex) => (
                  <Image
                    key={photoIndex}
                    source={{ uri: photo }}
                    style={[
                      this.constructor.styles.cardImage,
                      { height: `${100 / this.props.nextCard.photos.length}%` },
                    ]}
                  />
                ))}
            </View>
            <View style={this.constructor.styles.textOverlay}>
              <Text style={[this.constructor.styles.cardTitle]}>
                {this.props.nextCard.name}
              </Text>

              {/* google maps (non)touchable button */}
              <View style={this.constructor.styles.mapButtonContainer}>
                  <Image
                    source={require("../../../assets/image-removebg-preview.png")}
                    style={this.constructor.styles.mapIcon}
                  />
                  {/* <Text style={this.constructor.styles.buttonText}>Open in Maps</Text> */}
              </View>

            </View>
          </Animated.View>
        )}


        {isNextNextCard && (
          <Animated.View
            style={[
              this.constructor.styles.card,
              {
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
                zIndex: 0,
              },
            ]}
          >
            {/* Render content for the next card here */}
            <View style={this.constructor.styles.imageContainer}>
              {this.props.nextnextCard.photos
                .slice(0, 4)
                .map((photo, photoIndex) => (
                  <Image
                    key={photoIndex}
                    source={{ uri: photo }}
                    style={[
                      this.constructor.styles.cardImage,
                      {
                        height: `${
                          100 / this.props.nextnextCard.photos.length
                        }%`,
                      },
                    ]}
                  />
                ))}
            </View>
            <View style={this.constructor.styles.textOverlay}>
              <Text style={[this.constructor.styles.cardTitle]}>
                {this.props.nextnextCard.name}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
      // </>
    );
  }

  static styles = StyleSheet.create({
    card: {
      flex: 0.9,
      backgroundColor: "white",
      borderRadius: 20,
      elevation: 3,
      shadowColor: "black",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      margin: 10,
      top: 0.1 * SCREEN_HEIGHT,
      overflow: "hidden",
      position: "absolute",
      width: 0.96 * SCREEN_WIDTH,
      height: 0.78 * SCREEN_HEIGHT,
    },
    imageContainer: {
      flex: 1,
    },
    cardImage: {
      flex: 1, // Each image takes equal space within the container
      resizeMode: "cover", // Ensure images cover the available space
    },


    textOverlay: {
      position: "absolute",
      bottom: 0 * SCREEN_HEIGHT,
      width: 0.96 * SCREEN_WIDTH, //same width as the card
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
    },
    cardTitle: {
      padding: 0.005 * SCREEN_HEIGHT,
      fontWeight: "bold",
      textAlign: "left",
      left: 0.03*SCREEN_WIDTH,
      color: "white",
      fontSize: 0.07 * SCREEN_WIDTH,
      maxWidth: 0.96 * SCREEN_WIDTH
    },


    mapButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "left",
      left: 0.15*SCREEN_WIDTH,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    // mapButton: {
    //   // backgroundColor: "#4285F4", // Google Maps color
    //   flexDirection: "row",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   padding: 10,
    //   borderRadius: 5,
    //   marginTop: 10,
    // },
    // buttonText: {
    //   color: "white",
    //   fontSize: 16,
    //   fontWeight: "bold",
    //   marginRight: 10,
    // },
    mapIcon: {
      width: 0.08*SCREEN_WIDTH,
      height: 0.05*SCREEN_HEIGHT,
    },
  });
}

export default Cards;