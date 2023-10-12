import Matter from "matter-js";
import Constants from "./Constants";

const Physics = (entities, { touches, time }) => {
  let engine = entities.physics.engine;

  // Handle collision events
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      // Check if it's a collision between ball and brick
      if (
        (bodyA.label === "ball" && bodyB.label === "brick") ||
        (bodyA.label === "brick" && bodyB.label === "ball")
      ) {
        // Mark the brick as destroyed (inactive)
        if (bodyA.label === "brick") {
          entities.bricks[bodyA.id].active = false;
        } else {
          entities.bricks[bodyB.id].active = false;
        }
      }
    });
  });

  
  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;
