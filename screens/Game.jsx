import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { activateKeepAwakeAsync } from "expo-keep-awake";
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Constants from "../main/Constants";
import Physics from "../main/Physics";
import Racket from "../main/Racket";
import Ball from "../main/Ball";
import Wall from "../main/Wall";
import heart from "../assets/heart.png";
//import { gyroscope } from "react-native-sensors";
import { Gyroscope } from "expo-sensors";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true, // game on / off
      start: false, // ball thrown
      lives: 3, // nb lives
    };
    this.gameEngine = null;
    this.entities = this.setupWorld();
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0;

    let racket = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION,
      Constants.RACKET_WIDTH,
      Constants.RACKET_HEIGHT,
      { isStatic: true }
    );

    let ball = Matter.Bodies.circle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION - 20,
      6,
      {
        isStatic: false,
        restitution: 1,
        inertia: Infinity, // no speed loss due to torque in a collision
        friction: 0, // perfect slide in a collision
        frictionAir: 0, // no air resistance
        frictionStatic: 0, // never stop moving
        collisionFilter: { group: -1 },
      }
    );
    ball.label = "ball";

    let wallLeft = Matter.Bodies.rectangle(
      Constants.WALL_WIDTH / 2,
      Constants.WALL_HEIGHT / 2,
      Constants.WALL_WIDTH,
      Constants.WALL_HEIGHT,
      {
        isStatic: true,
      }
    );

    let wallRight = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.WALL_WIDTH / 2,
      Constants.MAX_HEIGHT - Constants.WALL_HEIGHT / 2,
      Constants.WALL_WIDTH,
      Constants.WALL_HEIGHT,
      {
        isStatic: true,
      }
    );

    let ceiling = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.WALL_WIDTH / 2,
      Constants.WALL_HEIGHT,
      Constants.WALL_WIDTH,
      {
        isStatic: true,
      }
    );

    let floor = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.MAX_HEIGHT,
      Constants.WALL_HEIGHT,
      Constants.WALL_WIDTH,
      {
        isStatic: true,
      }
    );
    floor.label = "floor";

    Matter.World.add(world, [
      racket,
      ball,
      wallLeft,
      wallRight,
      ceiling,
      floor,
    ]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      var pairs = event.pairs;

      let labels = [pairs[0].bodyA.label, pairs[0].bodyB.label];
      if (labels.indexOf("ball") >= 0 && labels.indexOf("floor") >= 0) {
        if (this.state.lives > 1) {
          this.gameEngine.dispatch({ type: "ball-lost" });
        } else {
          this.gameEngine.dispatch({ type: "game-over" });
        }
      }
    });

    return {
      physics: { engine: engine, world: world },
      racket: {
        body: racket,
        size: [Constants.RACKET_WIDTH, Constants.RACKET_HEIGHT],
        color: "#393eca",
        renderer: Racket,
      },
      ball: {
        body: ball,
        size: [20, 20],
        color: "#ffffff",
        renderer: Ball,
      },
      wallLeft: {
        body: wallLeft,
        size: [Constants.WALL_WIDTH, Constants.WALL_HEIGHT],
        color: "#3464ff",
        renderer: Wall,
      },
      wallRight: {
        body: wallRight,
        size: [Constants.WALL_WIDTH, Constants.WALL_HEIGHT],
        color: "#3464ff",
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.WALL_HEIGHT, Constants.WALL_WIDTH],
        color: "#d6e0ff",
        renderer: Wall,
      },
      floor: {
        body: floor,
        size: [Constants.WALL_HEIGHT, Constants.WALL_WIDTH],
        color: "red",
        renderer: Wall,
      },
    };
  };

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.resetBall();
      this.setState({
        running: false,
        lives: 0,
      });
    } else if (e.type === "ball-lost") {
      let newLives = this.state.lives - 1;
      this.resetBall();
      this.setState({
        start: false,
        lives: newLives,
      });
    }
  };

  resetBall = () => {
    Matter.Body.setVelocity(this.entities.ball.body, { x: 0, y: 0 });

    Matter.Body.setPosition(this.entities.ball.body, {
      x: Constants.RACKET_START_X_POSITION,
      y: Constants.RACKET_Y_POSITION - 20,
    });
  };

  start = (e) => {
    console.log("start");
    activateKeepAwakeAsync();
    /*  gyroscope.subscribe(({ x, y, z, timestamp }) => {
      //this.setState({gyroscopeY: y, gyroscopeX: x, gyroscopeZ: z})
      let newRacketX = this.entities.racket.body.position.x;
      if (Math.abs(x) > Math.abs(y)) {
        newRacketX = newRacketX + x;
      } else {
        newRacketX = newRacketX + y;
      }

      if (newRacketX < Constants.RACKET_MIN_X_POSITION) {
        newRacketX = Constants.RACKET_MIN_X_POSITION;
      }

      if (newRacketX > Constants.RACKET_MAX_X_POSITION) {
        newRacketX = Constants.RACKET_MAX_X_POSITION;
      }

      Matter.Body.setPosition(this.entities.racket.body, {
        x: newRacketX,
        y: this.entities.racket.body.position.y,
      });
    }); */
    this.setState({
      start: true,
    });

    let force = 10;

    let angle = Matter.Vector.angle(this.entities.ball.body.position, {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });

    Matter.Body.setVelocity(this.entities.ball.body, {
      x: force * Math.cos(angle),
      y: force * Math.sin(angle),
    });
  };

  reset = () => {
    //this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      start: false,
      lives: 3,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>
        <Image source={heart} style={styles.heart} />
        <Text style={styles.livesText}>{this.state.lives}</Text>
        {!this.state.running && (
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this.reset}
          >
            <View style={styles.gameOverFullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
            </View>
          </TouchableOpacity>
        )}
        {!this.state.start && (
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this.start}
          >
            <View style={styles.startFullScreen}>
              <Text style={styles.startText}>Click to start</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: "white",
    fontSize: 48,
  },
  startText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
  },
  gameOverFullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  startFullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  heart: {
    position: "absolute",
    bottom: 5,
    left: 20,
    flex: 1,
  },
  livesText: {
    position: "absolute",
    bottom: 4,
    left: 50,
    flex: 1,
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
