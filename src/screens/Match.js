import {
  View,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  SafeAreaView,
} from "react-native";
import App from "./MainScreen/Main";
import { Gesture, ScrollView } from "react-native-gesture-handler";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React, { Component } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StateContext from "../states/StateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenHeight } from "@rneui/base";

class Match extends Component {
  static contextType = StateContext;

  componentDidMount() {
    this.storeSwipedCardData(); // Initial storage when component mounts

    this.interval = setInterval(() => {
      this.storeSwipedCardData(); // Store swiped cards every 5 seconds
    }, 3000); // Update every 5 seconds (5000 milliseconds)
  }

  storeSwipedCardData = async () => {
    const { state, setState } = this.context;
    try {
      const swipedCards = await AsyncStorage.getItem("swipedCards");
      if (swipedCards) {
        const parsedSwipedCards = JSON.parse(swipedCards);

        const cardData = [];

        // Fetch data for each swiped card
        await Promise.all(
          parsedSwipedCards.map(async (card) => {
            try {
              // Push fetched data to cardData array
              cardData.push(card);
            } catch (error) {
              console.error("Error storing card data:", error);
            }
          })
        );

        // Store cardData in state
        setState((prevState) => ({
          ...prevState,
          selectedCards: cardData,
        }));
      }
    } catch (error) {
      // Handle AsyncStorage errors
      console.error("Error storing swiped cards:", error);
    }
  };

  render() {
    const { state } = this.context;
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.rowContainer}>
          {state.selectedCards.map((card, index) => {
            const isLengthOdd = state.selectedCards.length % 2 !== 0;
            const marginBottomCondition = isLengthOdd
              ? index >= state.selectedCards.length - 1
              : index >= state.selectedCards.length - 2;

            const marginBottom = marginBottomCondition ? 0.040 * SCREEN_HEIGHT : 0;

            return (
              <View
                key={index}
                style={[
                  styles.card,
                  {
                    marginTop: (index === 0 || index === 1) ? 0.08 * SCREEN_HEIGHT : 0.04 * SCREEN_HEIGHT,
                    marginBottom: marginBottom,
                  },
                ]}
              >
                {/* Image rendering */}
                {card.photos.slice(0, 4).map((photo, photoIndex) => (
                  <Image
                    key={photoIndex}
                    source={{ uri: photo }}
                    style={[
                      styles.cardImage,
                      {
                        height: `${100 / card.photos.length}%`,
                      },
                    ]}
                  />
                ))}

                {/* Text Overlay */}
                <View style={styles.textOverlay}>
                  <Text style={styles.cardTitle}>{card.name}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </GestureHandlerRootView>
    );
  }
}

styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // To start from left
    alignContent: "flex-start", // To align items at the start of rows
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    // marginVertical: 0.02 * SCREEN_HEIGHT, // Adjusts vertical margin (top and bottom)
    marginHorizontal: 0.05 * SCREEN_WIDTH, // Adjusts horizontal margin (left and right)
    overflow: "hidden",
    width: 0.4 * SCREEN_WIDTH,
    height: 0.3 * SCREEN_HEIGHT,
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
    textAlign: "centre",
    left: 0.03 * SCREEN_WIDTH,
    color: "white",
    fontSize: 0.05 * SCREEN_WIDTH,
    maxWidth: 0.4 * SCREEN_WIDTH, // Set maximum width to match text overlay width
  },
});

export default Match;
