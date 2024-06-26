import React, { Component } from "react";
import {
  View,
  Modal,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ViewStyle
} from "react-native";
import Slider from "@react-native-community/slider";
import { IconButton } from "react-native-paper";
import RNCheckboxCard from "react-native-checkbox-card";
import { Octicons } from "@expo/vector-icons";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import key from "../../constants/secret";
import { Btn } from "../../components/Btn/ApplyChangesFilter";
import _ from 'lodash';

class FilterModal extends Component {
  api_key = key;

  state = {
    searchQuery: "",
    placeName: "",
    region: {
      latitude: this.props.lat,
      longitude: this.props.long,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    },
    markerCoordinates: { latitude: this.props.lat, longitude: this.props.long },
    tempArray: []
  };

  reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.region.latitude},${this.state.region.longitude}&key=${this.api_key}`;

  updateSearch = (location) => {
    this.setState({ searchQuery: location });
  };
  searchLocation = async (location) => {
    const { searchQuery } = this.state;
    const formattedAddress = encodeURIComponent(location);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${this.api_key}`
      );

      if (!response.ok) {
        //console.log("2");
        Alert.alert("Error", "Network Error");
      }

      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        this.setState((prevState) => ({
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: prevState.region.latitudeDelta,
            longitudeDelta: prevState.region.longitudeDelta,
          },
        }));
        this.updateMarker(
          this.state.region.latitude,
          this.state.region.longitude
        );
        this.fetchPlaceName();
      } else {
        Alert.alert("Error", "No results found");
      }
    } catch (error) {
      Alert.alert("Error", "Network Error");
    }
  };

  updateMarker = (latitude, longitude) => {
    this.setState({
      markerCoordinates: { latitude, longitude },
    });
  };

  fetchPlaceName = async () => {
    try {
      const response = await fetch(this.reverseGeocodeUrl);
      const data = await response.json();
      this.setState({
        placeName: data.results[0].formatted_address,
      });
    } catch (error) {
      Alert.alert("Error", "Network Error");
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.handleOpen();
    }
  }

  //updating radius and keyword to orginal state when "x" pressed instead of apply changes 
  handleOpen = () => {
    this.tempState = _.cloneDeep(this.props.state);
  };

  handleClose = () => {
    this.props.revertState(this.tempState);
    this.props.onClose();
    this.state.tempArray.forEach(keyword => {
        this.props.toggleKeyword(keyword);
    });
  };

  render() {
    const { searchQuery, region, markerCoordinates, placeName } = this.state;

    const emojiMap = {
      "cafe": '𓍢ִ໋☕️✧˚ ༘ ⋆',
      "fast food": '༼ つ ◕_◕ ༽つ🍰🍔🍟',
      "food court": '🍜🍚',
      "chinese": '🥡🥢',
      "japanese": '🍣🍡',
      "korean": '🍱🇰🇷',
      "italian": '🍝🍕',
      "mexican": '🌮',
      "western": '🥩😋',
      "thai": '🍍🙏',
      "vegetarian": '˚˖𓍢ִ໋🍃✧˚.🥗⋆',
      "vegan": '🌿: ^🥬',
      "halal": '✩₊˚.⋆☾⋆⁺₊✧',
    };
    

    return (
      <View>
        <Modal
          style={{ zIndex: 0 }}
          animationType="slide"
          // transparent={true}
          // presentationStyle="overFullScreen"
          // from="right"
          // to="left"
          visible={this.props.visible}
          onRequestClose={this.props.onClose}
          items
        >
          <View style={styles.narrowSearchContainer}>
            <Text style={styles.narrowSearchText}> Narrow or Expand your search  🔍</Text>
            <View style={styles.line}></View>
            <IconButton
              style={styles.iconbutton}
              icon={() => <Octicons name="x" size={29} color="black" />}
              onPress={() => {
                this.props.onClose();
                this.handleClose();  //revert the radius slider to orginal since changes not applied
                this.state.tempArray=[];
              }}
            />
          </View>
          <ScrollView
            bounces={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 0.0 * SCREEN_HEIGHT,
              paddingBottom: 0.1 * SCREEN_HEIGHT, //gap between all items in scrollview and bottom of scrollview
            }}
          >
            <View style={styles.scrollview}>
              {/* radius slider  */}
              <Text style={{marginTop: 0.05*SCREEN_HEIGHT, fontSize: 15, textAlign: "left", fontWeight: '500'}}>Radius: {this.props.radius.toFixed(1)}km</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={5}
                value={this.props.radius}
                onValueChange={this.props.handleRadiusChange}
                step={0.1}
                minimumTrackTintColor={"black"}
              />

              {/* keywords */}
              {/* <Text>Select Keywords:</Text> */}
              <View style={styles.keywordsContainer}>
                {this.props.keywords.map((keyword, index) => {
                  const emoji = emojiMap[keyword.txt] || '🔍';
                  const keywordTextWithEmoji = `${keyword.txt}   ${emoji}`;
                  
                  return (
                    <View key={index} style={{ marginBottom: 0.01 * SCREEN_HEIGHT }}>
                      <RNCheckboxCard
                        textStyle={styles.keywordText}
                        borderRadius={0.015 * SCREEN_HEIGHT}
                        text={keywordTextWithEmoji}
                        height={0.05 * SCREEN_HEIGHT}
                        isChecked={keyword.isChecked}
                        circleBackgroundColor="#d3d3d3"
                        width={0.9 * SCREEN_WIDTH}
                        onPress={() => {
                          // Assuming 'keyword' is accessible here
                          let tempArray = [...this.state.tempArray]; // Make a copy of the temp array
                          tempArray.push(keyword); // Add the keyword to the temporary array
                          this.setState({ tempArray }); // Update the state with the new temporary array
                          this.props.toggleKeyword(keyword);
                        }}
                      />
                    </View>
                  );
                })}
              </View>

              <View
                style={{ height: 0.3 * SCREEN_HEIGHT, width: 1 * SCREEN_WIDTH }}
              >
                {/* MapView */}
                <MapView
                  style={{ flex: 1 }}
                  provider={PROVIDER_GOOGLE}
                  region={region}
                  zoomTapEnabled={true}
                  zoomEnabled={true}
                >
                  {/* Marker component */}
                  <Marker
                    coordinate={markerCoordinates} // Use marker coordinates
                    // title={placeName} seems to have some error in getting API
                    // tooltip={true}
                    // description="This is your specified location"
                  />
                </MapView>
              </View>

              <View
                style={{
                  height: 0.35 * SCREEN_HEIGHT,
                  width: 1 * SCREEN_WIDTH,
                  zindex: 100,
                }}
              >
                <GooglePlacesAutocomplete
                  scrollEnabled={false}
                  placeholder="Change location"
                  value={searchQuery}
                  onPress={(data, details = null) => {
                    this.searchLocation(data.description);
                    this.updateSearch(data.description);
                  }}
                  query={{
                    key: key,
                    language: "en",
                  }}
                  fetchDetails={true}
                  enablePoweredByContainer={false}
                />
              </View>
            </View>
          </ScrollView>
          <Btn
            title={"Apply Changes"}
            onPress={() => {
              this.props.resetloading();
              this.props.onClose();
              this.props.handleLocationChange(
                region.latitude,
                region.longitude
              );
              this.props.handleRestaurantSearch();
            }}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  narrowSearchContainer: {
    alignItems: "center",
    flex: 0.17,
    top: 0.03 * SCREEN_HEIGHT,
  },
  narrowSearchText: {
    fontSize: 0.021*SCREEN_HEIGHT,
    fontWeight: "bold",
    marginBottom: 5,
    top: 0.053 * SCREEN_HEIGHT,
    position: 'absolute',
    left: 0.18 * SCREEN_WIDTH
  },
  line: {
    width: "100%",
    height: 0.5,
    backgroundColor: "grey",
    position: 'absolute',
    top: 0.115*SCREEN_HEIGHT
  },


  scrollview: {
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconbutton: {
    position: "absolute",
    top: 0.035 * SCREEN_HEIGHT, // Adjust this value as needed for top spacing
    left: 0.01 * SCREEN_HEIGHT, // Adjust this value as needed for left spacing
  },


  slider: {
    width: 0.85 * SCREEN_WIDTH,
    height: 0.09 * SCREEN_HEIGHT,
  },


  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
    justifyContent: 'flex-start', // To start from the left
    alignContent: 'flex-start', // To align items at the start of rows
    marginTop: 0.04 * SCREEN_HEIGHT,
    marginBottom: 0.03 * SCREEN_HEIGHT,
    alignItems: 'center',
  },
  keywordRow: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure items are aligned in the center vertically
    marginBottom: 0.01*SCREEN_HEIGHT,
    marginTop: 0.01*SCREEN_HEIGHT,
    marginLeft: 0.043*SCREEN_WIDTH,
    width: '40%', 
  },
  keywordItem: {
    alignItems: 'center',
    flex: 1, // Allow text to take up available space
  },
  keywordText: {
    textTransform: 'uppercase',
    fontSize: 0.016*SCREEN_HEIGHT,
    fontWeight: "bold",
    textDecorationLine: 'none',
  },
  checkboxItem: {
    fontWeight: "bold",
    marginLeft: 0, // Add some space between the text and the checkbox
  },
});

export default FilterModal;
