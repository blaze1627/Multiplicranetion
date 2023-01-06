var game = {
    cycle: 0,
    width: 1200,
    height: 800,
}
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Bounds = Matter.Bounds,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite;
// create an engine
var engine = Engine.create();
var myCanvas = document.getElementById("matterCanvas");
var render = Render.create({
    canvas: myCanvas,
    engine: engine,
    options: {
        width: 1200,
        height: 900,
        pixelRatio: 1,
        background: 'rgba(0, 0, 25, 1)',
        wireframeBackground: '#222',
        enabled: false,
        wireframes: false,
        showVelocity: false,
        showAngleIndicator: false,
        showCollisions: false,
    }
});
//create number blocks
var blocks = [];
for (var i = 0; i <= 9; i += 1) {
    var box = Bodies.rectangle(
        Math.floor(Math.random() * (700 - 100 + 1) + 100),
        Math.floor(Math.random() * (700 - 650 + 1) + 650),
        50,
        50, {
            render: {
                sprite: {
                    texture: '/numberblocks/' + (i + 1) + '.png'
                }
            }
        }
    );
    Composite.add(engine.world, box);
    blocks.push(Matter.Composite.get(engine.world, i + 1, 'body'));
}
//create walls around game
var offset = 5;
wall1 = Bodies.rectangle(400, -offset, game.width * 2 + 2 * offset, 50, {
    isStatic: true,


    collisionFilter: {
        category: 0x001,
        mask: 0x001
    },
});
wall2 = Bodies.rectangle(400, game.height + offset + 300, game.width * 2 + 2 * offset, 500, {
    isStatic: true,

    collisionFilter: {
        category: 0x001,
        mask: 0x001
    },
});
wall3 = Bodies.rectangle(game.width + offset, 300, 50, game.height * 2 + 2 * offset, {
    isStatic: true,
    collisionFilter: {
        category: 0x001,
        mask: 0x001
    },
});
wall4 = Bodies.rectangle(-offset, 300, 50, game.height * 2 + 2 * offset, {
    isStatic: true,
    collisionFilter: {
        category: 0x001,
        mask: 0x001
    },
});
Composite.add(engine.world, [wall1, wall2, wall3, wall4]);


var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 1,
            render: {
                visible: false
            }
        },
        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
    }),

    magnet = Bodies.polygon(400, 200, 3, 50, {
        restitution: 0,
        render: {
            strokeStyle: 'black',
            fillStyle: 'lightgrey'
        },
        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
    }),
    base = Bodies.trapezoid(600, 45, 1000, 50, -0.1, {
        isStatic: true,
        collisionFilter: {
            category: 0x001,
        },
    }),
    baseLow = Bodies.rectangle(600, 125, 1000, 25, {
        isStatic: true,
        collisionFilter: {
            category: 0x001,
        },

    }),
    baseL = Bodies.rectangle(100, 90, 50, 50, {
        isStatic: true,
        collisionFilter: {
            category: 0x001,
        },

    }),
    baseR = Bodies.rectangle(1100, 90, 50, 50, {
        isStatic: true,
        collisionFilter: {
            category: 0x001,
        },

    }),
    trackWheel = Bodies.circle(500, 90, 20, {
        collisionFilter: {
            category: 0x010,
            mask: 0x001
        },
    }),
    armConstrain = Constraint.create({
        bodyA: trackWheel,
        bodyB: magnet,
        pointB: {
            x: 20,
            y: 35
        },
        stiffness: 0.001,
        damping: 0.05,
        length: 30
    }),
    magnetSensor = Bodies.circle(0, 0, 60, {
        isSensor: true,
        render: {
            visible: false
        },
        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
        //isStatic: true,
    }),

    numberSensor = Bodies.rectangle(1080, 600, 300, 50, {
        isSensor: true,
        isStatic: true,
        render: {
            visible: false
        },
        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
    }),

    /*platformWall = Bodies.rectangle(790, 775, 30, 300, {
        isStatic: true,

        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },

    }),*/
    equationFloor = Bodies.rectangle(1000, 640, 400, 25, {
        isStatic: true,

        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
    }),
    times = Bodies.rectangle(900, 600, 50, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: '/img/x.png'
            }
        },
        collisionFilter: {
            category: 0x001,
        },
    }),
    equals = Bodies.rectangle(1000, 600, 50, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: '/img/equal.png'
            }
        },
        collisionFilter: {
            category: 0x001,
            mask: 0x001
        },
    }),
    //set up multiplication problem
    numberOne = Math.floor(Math.random() * (10 - 1 + 1) + 1),
    numberTwo = Math.floor(Math.random() * (10 - 1 + 1) + 1),
    //console.log(numberOne)
    first = Bodies.rectangle(850, 600, 50, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: '/img/' + numberOne + '.png'
            }
        }
    }),
    second = Bodies.rectangle(950, 600, 50, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: '/img/' + numberTwo + '.png'
            }
        }
    });
    
numberSensor.collisionFilter.group = -1
magnetSensor.collisionFilter.group = -1

// add bodies to world
Composite.add(engine.world, [
    magnetSensor,
    mouseConstraint,
    magnet,
    base,
    baseLow,
    baseL,
    baseR,
    trackWheel,
    armConstrain,
    equationFloor,
    numberSensor,
    //platformWall,
    times,
    equals,
    first,
    second
]);
// run the renderer
Render.run(render);
// create runner
var runner = Runner.create();
// run the engine
Runner.run(runner, engine);
var theObject,
    xDist,
    yDist,
    mouseDown,
    lastNum = [],
    thingToAdd,
    formalName;

const limitMaxSpeed = () => {
    let maxSpeed = 20;
    if (trackWheel.velocity.x > maxSpeed) {
        Body.setVelocity(trackWheel, {
            x: maxSpeed,
            y: trackWheel.velocity.y
        });
    }

    if (trackWheel.velocity.x < -maxSpeed) {
        Body.setVelocity(trackWheel, {
            x: -maxSpeed,
            y: trackWheel.velocity.y
        });
    }

    if (trackWheel.velocity.y > maxSpeed) {
        Body.setVelocity(trackWheel, {
            x: trackWheel.velocity.x,
            y: maxSpeed
        });
    }

    if (trackWheel.velocity.y < -maxSpeed) {
        Body.setVelocity(trackWheel, {
            x: -trackWheel.velocity.x,
            y: -maxSpeed
        });
    }
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].velocity.x > maxSpeed) {
            Body.setVelocity(blocks[i], {
                x: maxSpeed,
                y: blocks[i].velocity.y
            });
        }

        if (blocks[i].velocity.x < -maxSpeed) {
            Body.setVelocity(blocks[i], {
                x: -maxSpeed,
                y: blocks[i].velocity.y
            });
        }

        if (blocks[i].velocity.y > maxSpeed) {
            Body.setVelocity(blocks[i], {
                x: blocks[i].velocity.x,
                y: maxSpeed
            });
        }

        if (blocks[i].velocity.y < -maxSpeed) {
            Body.setVelocity(blocks[i], {
                x: -blocks[i].velocity.x,
                y: -maxSpeed
            });
        }

    }
}

function pairLoop(event, touch){
    var pairs = event.pairs;
    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];
        magCheck(event, touch, pair);
    }
}
function magCheck(_event, touch, pair) { //runs on collisions events
        for (var k = 0; k <= 9; k++) {
            if (pair.bodyA === magnetSensor && pair.bodyB === blocks[k]) {
                magnetSensor.touching = touch;
                theObject = pair.bodyB;
            } else if (pair.bodyB === magnetSensor && pair.bodyA === blocks[k]) {
                magnetSensor.touching = touch;
                theObject = pair.bodyA;
            }
        }
        for (var l = 0; l <= 9; l++) {
            if (pair.bodyA === numberSensor && pair.bodyB === blocks[l]) {
                numberSensor.touching = true;
                if (pair.bodyB.id == 10) {
                    thingToAdd = 0;
                } else {
                    thingToAdd = pair.bodyB.id;
                }
                if (lastNum.length == 1) {
                    if (thingToAdd != lastNum[0]) {
                        lastNum.push(thingToAdd);
                        formalName = Matter.Composite.get(engine.world, pair.bodyA.id, 'body')
                        Matter.Body.setAngle(formalName, 0)
                        Matter.Body.setVelocity(magnetSensor, {
                            x: 0,
                            y: 0
                        })
                        Body.setPosition(formalName, {
                            x: 1130,
                            y: 600
                        });
                    }
                } else if (lastNum.length == 0) {
                    lastNum.push(thingToAdd);
                    formalName = Matter.Composite.get(engine.world, pair.bodyB.id, 'body')
                    Matter.Body.setAngle(formalName, 0)
                    Matter.Body.setVelocity(formalName, {
                        x: 0,
                        y: 0
                    })
                    Body.setPosition(formalName, {
                        x: 1080,
                        y: 600
                    });
                }
            } else if (pair.bodyB === numberSensor && pair.bodyA === blocks[l]) {
                numberSensor.touching = true;
                if (pair.bodyA.id == 10) {
                    thingToAdd = 0;
                } else {
                    thingToAdd = pair.bodyA.id;
                }
                if (lastNum.length == 1) {
                    if (thingToAdd != lastNum[0]) {
                        lastNum.push(thingToAdd);
                        formalName = Matter.Composite.get(engine.world, pair.bodyA.id, 'body')
                        Matter.Body.setAngle(formalName, 0)
                        Matter.Body.setVelocity(formalName, {
                            x: 0,
                            y: 0
                        })
                        Body.setPosition(formalName, {
                            x: 1130,
                            y: 600
                        });
                    }
                } else if (lastNum.length == 0) {
                    lastNum.push(thingToAdd);
                    formalName = Matter.Composite.get(engine.world, pair.bodyA.id, 'body')
                    Matter.Body.setAngle(formalName, 0)
                    Matter.Body.setVelocity(formalName, {
                        x: 0,
                        y: 0
                    })
                    Body.setPosition(formalName, {
                        x: 1080,
                        y: 600
                    });
                }
            }
        }
}
Events.on(engine, 'beforeUpdate', limitMaxSpeed);
//at the start of a colision for player
Events.on(engine, "collisionStart", function(event) {
    pairLoop(event, true)
});
//ongoing checks for collisions for player
Events.on(engine, "collisionActive", function(event) {
    pairLoop(event, true)
});
//at the end of a colision for player set ground to false
Events.on(engine, 'collisionEnd', function(event) {
    pairLoop(event, false);
})
var answer,
    response = "",
    betterLastNum;
if (numberOne == 10) {
    numberOne = 0;
}
if (numberTwo == 10) {
    numberTwo = 0;
}
answer = numberOne * numberTwo;
Events.on(runner, "afterTick", function(event) {
    if (lastNum.length > 0) {
        if (lastNum[0] == 0) {
            betterLastNum = 10;
        } else {
            betterLastNum = lastNum[0];
        }
        numberSensor.has = Matter.Composite.get(engine.world, betterLastNum, 'body');
        if (Matter.Collision.collides(numberSensor, numberSensor.has) === null) {
            lastNum = [];
        }
    }

    document.body.onmousedown = function() {
        mouseDown = 1;
    }
    document.body.onmouseup = function() {
        mouseDown = 0;
    }
    Matter.Body.setVelocity(magnetSensor, {
        x: 0,
        y: 0
    })
    Body.setPosition(magnetSensor, {
        x: magnet.position.x,
        y: magnet.position.y + 30
    });
    Matter.Body.setVelocity(numberSensor, {
        x: 0,
        y: 0
    })
    if (magnetSensor.touching === true && mouseDown === 1) {
        xDist = magnet.position.x - theObject.position.x;
        yDist = magnet.position.y - theObject.position.y;
        if (Math.abs(yDist) > 90) {
            theObject.force = {
                x: xDist * 0.00005,
                y: yDist * 0.00005
            };
            magnet.force = {
                x: -xDist * 0.00005,
                y: -yDist * 0.00005
            };
        }
        if (Math.abs(yDist) < 90) {
            /* realistic magnet :(((
                theObject.force = {
                    x: xDist * 0.0005,
                    y: yDist * 0.0005
                  };
                  magnet.force = {
                    x: -xDist * 0.0005,
                    y: -yDist * 0.0005
                  };
                */
            Matter.Body.setVelocity(theObject, {
                x: 0,
                y: 0
            })
            Body.setPosition(theObject, {
                x: theObject.position.x + (magnet.position.x - theObject.position.x) * 0.7,
                y: theObject.position.y + ((magnet.position.y + 50) - theObject.position.y) * 0.7
            });
        }
    }
    if (lastNum.length == 1) {
        if (lastNum[0] == answer) {
            playerWin();
        }
    }
    if (lastNum.length == 2) {
        if (lastNum[0] * 10 + lastNum[1] == answer) {
            playerWin();
        }
    }
});
Events.on(runner, "beforeTick", function(event) {
    game.cycle++;
});
function playerWin() {
    console.log("yay!");
    Composite.remove(engine.world, equationFloor);
    setTimeout(() => {
        Composite.add(engine.world, equationFloor);
    }, 1000);
    setTimeout(() => {
        makeNewEquation();
    }, 1000);
    
 
    
}

function makeNewEquation(){
    lastNum = [];
    numberOne = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    numberTwo = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    first.render.sprite.texture = '/img/' + numberOne + '.png';
    second.render.sprite.texture = '/img/' + numberTwo + '.png';
    if (numberOne == 10) {
        numberOne = 0;
    }
    if (numberTwo == 10) {
        numberTwo = 0;
    }
    answer = numberOne * numberTwo;

    

}