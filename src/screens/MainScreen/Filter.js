import React, { Component } from "react";
import {
  View,
  Modal,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { IconButton } from "react-native-paper";
import { CheckBox, SearchBar } from "react-native-elements";
import { Octicons } from "@expo/vector-icons";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { SCREEN_HEIGHT, SCREEN_WIDTH, TouchableOpacity } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import key from "../../constants/secret";


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
  };

  reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.region.latitude},${this.state.region.longitude}&key=${this.api_key}`;

  updateSearch = (location) => {
    this.setState({ searchQuery: location });
  };

  pressFirstSuggestion = () => {
    console.log("300")
    // if (googlePlacesRef.current) {
    //   googlePlacesRef.current.triggerSuggestionClicked(0); // Triggering the first suggestion
    // }
  };

  searchLocation = async (location) => {
    const { searchQuery } = this.state;
    const formattedAddress = encodeURIComponent(location);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${this.api_key}`
      );

      if (!response.ok) {
        console.log("2")
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
        this.fetchPlaceName()
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

  render() {
    const { searchQuery, region, markerCoordinates, placeName } = this.state;

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
          <ScrollView
            bounces={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 0.08 * SCREEN_HEIGHT,
              paddingBottom: 0.2 * SCREEN_HEIGHT, //gap between all items in scrollview and bottom of scrollview
            }}
          >
            <View style={styles.scrollview}>
              {/* radius slider  */}
              <Text>Radius: {this.props.radius.toFixed(1)}km</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={5}
                value={this.props.radius}
                onValueChange={this.props.handleRadiusChange}
                step={0.1}
              />

              {/* keywords */}
              {/* <Text>Select Keywords:</Text> */}
              {this.props.keywords.map((keyword) => (
                <View key={keyword.id}>
                  <Text>{keyword.txt}</Text>
                  <CheckBox
                    onPress={() => this.props.toggleKeyword(keyword)}
                    checked={keyword.isChecked}
                  />
                </View>
              ))}


              <View
                style={{ height: 0.4 * SCREEN_HEIGHT, width: 1 * SCREEN_WIDTH, zindex: 100 }}
              >
                <GooglePlacesAutocomplete
                  scrollEnabled={false}
                  placeholder='Change location'
                  value={searchQuery}
                  onPress={(data, details = null) => {
                    this.searchLocation(data.description);
                    this.updateSearch(data.description);
                  }}
                  query={{
                    key: key,
                    language: 'en',
                  }}
                  fetchDetails={true}
                  enablePoweredByContainer={false}
                />
              </View>

              <View
                style={{ height: 0.4 * SCREEN_HEIGHT, width: 1 * SCREEN_WIDTH }}
              >
                {/* SearchBar */}
                {/* <SearchBar
                  placeholder="Change location"
                  onChangeText={this.updateSearch}
                  onSubmitEditing={this.searchLocation}
                  value={searchQuery}
                  lightTheme={true}
                  round={true}
                  containerStyle={{ backgroundColor: "" }}
                /> */}

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

              {/* close 'X' button */}
              <IconButton
                style={styles.iconbutton}
                icon={() => <Octicons name="x" size={27} color="black" />}
                onPress={() => {
                  this.props.resetloading();
                  this.props.onClose();
                  this.props.handleLocationChange(region.latitude, region.longitude);
                  this.props.handleRestaurantSearch();
                }}
              />
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // scrollviewContainer: {
  //   flex: 1,
  //   // justifyContent: 'flex-end', // This will push the content to the bottom
  //   // paddingBottom: 100, // Adjust this value as needed for the distance from the bottom
  // },
  scrollview: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    // height : 0.5*SCREEN_HEIGHT
    // maxHeight: 40
    // bottom: 0.06*SCREEN_HEIGHT
  },
  iconbutton: {
    position: "absolute",
    top: 0.01 * SCREEN_HEIGHT, // Adjust this value as needed for top spacing
    left: 0.03 * SCREEN_HEIGHT, // Adjust this value as needed for left spacing
  },

  slider: {
    width: 0.7 * SCREEN_WIDTH,
    height: 0.09 * SCREEN_HEIGHT,
  },
});

export default FilterModal;
