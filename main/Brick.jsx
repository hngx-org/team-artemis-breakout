import React, { Component } from "react";
import { View, FlatList } from "react-native";

export default class Brick extends Component {
  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    return (
      <>
        <View
          style={{
            left: x,
            position: "absolute",
            top: y,
            width: width,
            height: height,
            backgroundColor: this.props.color,
            marginBottom: 2,
          }}
        />

        {/*  <FlatList
          numColumns={8}
          data={[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          ]}
          renderItem={({ item }) => (
            <View
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: this.props.color,
              }}
            />
          )}
        /> */}
      </>
    );
  }
}
