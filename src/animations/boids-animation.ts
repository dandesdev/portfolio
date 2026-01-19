import rough from "roughjs";
import vec from "./resources/vetores";
import createParticle from "./resources/particle";
import boids from "./resources/boids";
import type { Tparticle } from "./resources/types";
import { transformRGBtoRGBA, lerpStretchClamp } from "./resources/helpers";

export function initBoids(getScrollVelocity: () => number) {
  let container = document.getElementById("canvas-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "canvas-container";
    container.className =
      "absolute -z-10 top-0 left-0 w-full min-h-screen overflow-hidden";

    document.body.appendChild(container);
  }

  const canvas = document.createElement("canvas");
  canvas.id = "hero-canvas";
  container.appendChild(canvas);

  const canvasContainer = container as HTMLElement;
  const herocanvas = canvas as HTMLCanvasElement;
  const listButtons =
    document.querySelectorAll<HTMLAnchorElement>(".boidsReactBtn");

  let isDragging = false;
  let isOnbutton = false;
  const bodyStyles = getComputedStyle(document.body);
  const colors = {
    calm: bodyStyles.getPropertyValue("--boids-calm").trim(),
    hover: bodyStyles.getPropertyValue("--boids-excited").trim(),
    drag: bodyStyles.getPropertyValue("--boids-agressive").trim(),
  };
  const ctx = herocanvas.getContext("2d") as CanvasRenderingContext2D;
  let gridFontSize: number;
  const num = 30;
  let particles: Tparticle[] = [];
  let w = window.innerWidth;
  let h = window.innerHeight;
  const safeRadius = 5;
  const rc = rough.canvas(herocanvas);
  const normalMaxSpeed = 2;
  const normalMaxForce = 0.001;
  const increasedSpeed = 6;
  const increasedForce = 0.002;

  const mouse = { x: 0, y: 0 };
  const start = { x: 0, y: 0 };

  // Mouse events
  function mouseMove(e: MouseEvent) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }

  function mouseDown(e: MouseEvent) {
    start.x = e.pageX;
    start.y = e.pageY;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
    isDragging = true;
  }

  function mouseUp() {
    isDragging = false;
  }

  // Touch events
  function touchMove(e: TouchEvent) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
  }

  function touchStart(e: TouchEvent) {
    isDragging = true;
    start.x = e.changedTouches[0].pageX;
    start.y = e.changedTouches[0].pageY;
    mouse.x = start.x;
    mouse.y = start.y;
  }

  function touchEnd() {
    isDragging = false;
  }

  // Button hover events
  function buttonOver(e: MouseEvent) {
    isOnbutton = true;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }

  function buttonLeave() {
    isOnbutton = false;
  }

  // Attach listeners
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);

  window.addEventListener("touchmove", touchMove);
  window.addEventListener("touchstart", touchStart);
  window.addEventListener("touchend", touchEnd);

  listButtons.forEach((btn) => {
    btn.addEventListener("mouseover", buttonOver);
    btn.addEventListener("mouseleave", buttonLeave);
  });

  //-----SETUP CANVAS-------
  function setupCanvas() {
    w = window.innerWidth;
    //h = document.documentElement.scrollHeight;
    const contentHeight = document.body.scrollHeight;
    h = Math.max(window.innerHeight, contentHeight);
    herocanvas.width = w;
    herocanvas.height = h;
    gridFontSize =
      parseInt(getComputedStyle(canvasContainer).fontSize, 10) || 10;

    particles = [];
    for (let n = 0; n < num; n++) {
      const randomPosition = vec(
        10 + Math.random() * (w - 20),
        10 + Math.random() * (window.innerHeight * 0.9 - 20),
        0
      );
      const newParticle = createParticle({
        index: n,
        position: randomPosition,
        direction: vec().random2D(1),
        initialVelocity: vec().random2D(1),
        behaviours: [boids],
      });
      particles.push(newParticle);
    }
  }

  const update = () => {
    const scrollVelocity = getScrollVelocity();

    for (let i = 0; i < num; i++) {
      const tooClose = particles.filter(
        (particle) =>
          vec()
            .copy(particle.position)
            .distanceToSquared(particles[i].position) < safeRadius
      );
      const agents = particles.filter((x) => !tooClose.includes(x));
      particles[i].applyForces(agents);

      //scrolling force
      if (Math.floor(scrollVelocity) != 0) {
        const yForce = vec(0, scrollVelocity).limit(0.07);
        particles[i].vel.add(yForce);
      }
      //mouse follow force
      const distanceToMouse = vec()
        .copy(particles[i].position)
        .sub(vec(mouse.x, mouse.y))
        .mag();
      if (distanceToMouse < 400) {
        const followForce = vec()
          .copy(particles[i].position)
          .sub(vec().copy(vec(mouse.x, mouse.y)))
          .mult(-0.1)
          .limit(100);
        particles[i].acl.add(followForce);
      }

      if (isDragging) {
        const Rpanic = vec()
          .copy(particles[i].position)
          .sub(vec(mouse.x, mouse.y));
        const Fpanic = vec()
          .copy(Rpanic)
          .setMag(100000000)
          .div(Rpanic.magSquared())
          .mult(-1);
        particles[i].acl.add(Fpanic.div(particles[i].inertialMass));
      }

      if (isDragging || isOnbutton) {
        particles[i].move(increasedSpeed, increasedForce);
      } else {
        particles[i].move(normalMaxSpeed, normalMaxForce);
      }

      if (particles[i].position.x > w) particles[i].position.x = 1;
      if (particles[i].position.x < 0) particles[i].position.x = w - 1;
      if (particles[i].position.y > h) particles[i].position.y = 1;
      if (particles[i].position.y < 0) particles[i].position.y = h - 1;
    }
  };

  const show = () => {
    const scl = 9;
    particles.forEach((particle) => {
      const speedStretchFactor = 1 + particle.vel.magSquared() / 10;
      const v1 = vec(1, 0, 0).setMag(scl * speedStretchFactor);
      const rotationCorrection = v1.angleBetween(particle.vel);
      v1.rotate(rotationCorrection);
      const v2 = v1
        .clone()
        .rotate(Math.PI / 3)
        .setMag(scl / 2);
      const v3 = v1
        .clone()
        .rotate(-Math.PI / 3)
        .setMag(scl / 2);
      v1.add(particle.position);
      v2.add(particle.position);
      v3.add(particle.position);

      const distFromEdges =
        1 / (vec().copy(particle.position).x ** 2 + 0.01) +
        1 / ((w - vec().copy(particle.position).x) ** 2 + 0.01) +
        1 / (vec().copy(particle.position).y ** 2 + 0.01) +
        1 / ((h - vec().copy(particle.position).y) ** 2 + 0.01);

      const alphaDeviceSclFactor = gridFontSize > 12 ? 0.0003 : 0.002;
      const alpha = lerpStretchClamp(
        distFromEdges,
        0,
        alphaDeviceSclFactor,
        1,
        0
      );

      const customColorCalm = transformRGBtoRGBA(colors.calm, alpha);
      const customColorAccent = transformRGBtoRGBA(colors.hover, alpha);
      const customColorDrag = transformRGBtoRGBA(colors.drag, alpha);

      rc.polygon(
        [
          [v1.x, v1.y],
          [v2.x, v2.y],
          [v3.x, v3.y],
        ],
        {
          stroke: isDragging
            ? "none"
            : isOnbutton
            ? customColorAccent
            : customColorCalm,
          fill: isDragging ? customColorDrag : "transparent",
          fillStyle: "solid",
        }
      );
    });
  };

  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (herocanvas.width != window.innerWidth) {
      setupCanvas();
    }
    ctx.clearRect(0, 0, herocanvas.width, herocanvas.height);
    update();
    show();
  }

  setupCanvas();
  animate();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mousedown", mouseDown);
    window.removeEventListener("mouseup", mouseUp);
    window.removeEventListener("touchmove", touchMove);
    window.removeEventListener("touchstart", touchStart);
    window.removeEventListener("touchend", touchEnd);
  };
}
