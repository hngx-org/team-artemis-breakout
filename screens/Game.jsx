import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
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
import Brick from "../main/Brick";
import Brick2 from "../main/Brick2";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true, // game on / off
      start: false, // ball thrown
      lives: 3, // nb lives
      paddleX: 0,

      paddlePosition: (Dimensions.get("window").width - 100) / 2,
      x: 0,
      y: 0,
      z: 0,
      subscription: null,
    };
    this.gameEngine = null;
    this.entities = this.setupWorld();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePaddleMove,
    });
  }

  handlePaddleMove = (e, gestureState) => {
    if (this.entities.racket) {
      // Update the position of the racket's body
      let newPaddlePosition = gestureState.moveX - 100 / 2;
      if (newPaddlePosition < 0) {
        newPaddlePosition = 0;
      } else if (newPaddlePosition > Dimensions.get("window").width - 100) {
        newPaddlePosition = Dimensions.get("window").width - 100;
      }

      Matter.Body.setPosition(this.entities.racket.body, {
        x: newPaddlePosition + 100 / 2, // Adjusted for the width of the racket
        y: this.entities.racket.body.position.y, // Keep the same Y position
      });

      // Update the state if you need to track the position in your component's state
      this.setState({ paddlePosition: newPaddlePosition });
    }
  };

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0;

    let bricks = Matter.Bodies.rectangle(
      Constants.BRICK_START_X_POSITION,
      Constants.BRICK_START_Y_POSITION,
      Constants.BRICK_WIDTH,
      Constants.BRICK_HEIGHT,
      {
        isStatic: true,
      }
    );

    let bricks2 = Matter.Bodies.rectangle(
      Constants.BRICK_START_X_POSITION2,
      Constants.BRICK_START_Y_POSITION2,
      Constants.BRICK_WIDTH2,
      Constants.BRICK_HEIGHT2,
      {
        isStatic: true,
      }
    );
    let racket = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION,
      Constants.RACKET_WIDTH,
      Constants.RACKET_HEIGHT,
      { isStatic: true }
    );

    let ball = Matter.Bodies.circle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION - 12,
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
      bricks,
      bricks2,
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
      brick: {
        body: bricks,
        color: "#29ff11",
        size: [Constants.BRICK_WIDTH, Constants.BRICK_HEIGHT],
        renderer: Brick,
      },
      brick2: {
        body: bricks2,
        color: "#29ff11",
        size: [Constants.BRICK_WIDTH2, Constants.BRICK_HEIGHT2],
        renderer: Brick2,
      },
      racket: {
        body: racket,
        size: [Constants.RACKET_WIDTH, Constants.RACKET_HEIGHT],
        color: "#393eca",
        paddlePosition: this.state.paddlePosition,
        renderer: Racket,
      },
      ball: {
        body: ball,
        size: [15, 15],
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

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _slow = () => Gyroscope.setUpdateInterval(1000);

  _fast = () => Gyroscope.setUpdateInterval(16);

  _subscribe = () => {
    this.setState({
      subscription: Gyroscope.addListener((gyroscopeData) => {
        this.setState({
          x: gyroscopeData.x,
          y: gyroscopeData.y,
          z: gyroscopeData.z,
        });
      }),
    });
  };

  _unsubscribe = () => {
    if (this.state.subscription) {
      this.state.subscription.remove();
      this.setState({ subscription: null });
    }
  };

  render() {
    //console.log(this.entities.ball);
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={{
            ...this.entities,
            object: {
              position: [20, 20],
              renderer: <View style={styles.object} />,
            },
          }}
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
  paddle: {
    position: "absolute",
    width: 100,
    height: 20,
    backgroundColor: "red",
    marginBottom: 50,
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
  object: {
    width: 50,
    height: 50,
    backgroundColor: "blue",
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
