window.onload = function() {
    initUI();
}

window.onmessage = (event) => {
  console.log("C2 message received from parent");
  if (event.data) {
    updateSelection(event.data.content);
  }
}

const assets = "assets/"
// const arrowsFile = "arrows.png";
const units = 12;
const maxFlavors = 5;
const initialAdd = 2;

var optionData;
var width;
var height;
var state;
var buttons;
var controls;
var capacity;
var helpText;
var selected;

function initUI() {
    optionData = flavorData;
    state = new Array(flavorData.length);
    state.fill(0);

    width = 700;
    height = 800;

    var svgNode = document.getElementById("svgCanvas");
    while (svgNode.firstChild) {
        svgNode.removeChild(svgNode.firstChild);
    }

    draw = SVG('svgCanvas').size(width, height);
    controls = draw.group();
    capacity = units;
    selected = 0;

    helpText = draw.text("");
    helpText.font({family:'Helvetica', size:25});
    helpText.move(200,0);
    updateUI();
}

function updateSelection(selectionData) {
    console.log("C2 updateSelection");

    //Determine how many flavors are now selected
    let nowSelected = 0;
    let priorSelected = 0;
    let maxSelected = 0;
    let minSelected = units;

    for (let i = 0; i < selectionData.length; i++) {
        if (selectionData[i] > 0) nowSelected++;
        if (state[i] > 0) priorSelected++;
        if (state[i] > maxSelected) maxSelected = state[i];
        if (state[i] > 0 && state[i] < minSelected) minSelected = state[i];
    }

    let action = "UpdateRecipe";

    if (nowSelected == 0) {
        //Just clear everything out
        console.log("Clearing bottle");
        for (let i = 0; i < selectionData.length; i++) {
            state[i] = 0;
        }
    } else if (nowSelected == 1) {
        //There's only one flavor and it's new
        console.log("One flavor");
        for (let i = 0; i < selectionData.length; i++) {
            if (selectionData[i] > 0) {
                state[i] = units;
            } else {
                state[i] = 0;
            }
        }
    // } else if (nowSelected == 1 && priorSelected >= 1) {
    //     //There's only one flavor but we used to have more
    //     console.log("Down to one flavor");
    //     for (let i = 0; i < selectionData.length; i++) {
    //         if (selectionData[i] == 0) {
    //             state[i] = 0;
    //         }
    //     }

    // } else if (nowSelected == 2) {
    //     if (capacity < initialAdd && priorSelected < 2) {
    //         //Our recipe is already maxed and we're adding. So we balance.
    //         console.log("Two full flavors. Balancing.");
    //         for (let i = 0; i < selectionData.length; i++) {
    //             if (selectionData[i] > 0 && state[i] > units/2) {
    //                 state[i] -= units/2;
    //             } else if (selectionData[i] > 0 && state[i] == 0) {
    //                 state[i] = units/2;
    //             }
    //         }
    //
    //     } else if (capacity >= initialAdd && priorSelected < 2) {
    //         //Our recipe not too full and we're adding.
    //         console.log("Empty 2-recipe. Adding.");
    //         for (let i = 0; i < selectionData.length; i++) {
    //             if (selectionData[i] > 0 && state[i] == 0) {
    //                 state[i] = capacity;
    //             }
    //         }
    //     } else  {
    //         //General case
    //         console.log("General 2-case");
    //         if (selectionData[i] > 0 && state[i] == 0) {
    //             state[i] = initialAdd;
    //         } else if (selectionData[i] == 0 && state[i] > 0) {
    //             state[i] = 0;
    //         }
    //     }
    //
    } else if (nowSelected <= maxFlavors) {

        let frac = units / nowSelected;
        let fair = Math.floor(frac);
        let even = false;
        if (frac == fair) even = true;

        console.log("min:"+minSelected+" max:"+maxSelected+" frac:"+frac+"fair:"+fair+" even:"+even);

        if (capacity == 0 && minSelected == maxSelected && even) {
            //We have our ideal case
            console.log("ideal case");
            for (let i = 0; i < selectionData.length; i++) {
                if (selectionData[i] > 0) {
                    state[i] = fair;
                } else if (selectionData[i] == 0 && state[i] > 0) {
                    state[i] = 0;
                }
            }
        }

        else if (capacity == 0 && minSelected == maxSelected && !even) {
            //We have a full even bottle but are going to end up with asymmetry
            let newAmount = priorSelected;

            console.log("full with asymmetry");
            for (let i = 0; i < selectionData.length; i++) {
                if (selectionData[i] > 0 && state[i] == 0) {
                    state[i] = newAmount;
                } else if (selectionData[i] > 0 && state[i] > 0) {
                    state[i]--;
                } else if (selectionData[i] == 0 && state[i] > 0) {
                    state[i] = 0;
                }
            }
        }

        else if (capacity == 0 && nowSelected > priorSelected) {
            //We remove from flavors until we have covered the initial add
            console.log("removing to initial add");
            removed = 0;
            for (let i = 0; i < selectionData.length; i++) {
                if (selectionData[i] > 0 && state[i] == 0) {
                    state[i] = initialAdd;
                } else if (selectionData[i] > 0 && state[i] > 1 && removed < initialAdd) {
                    state[i]--;
                    removed++;
                } else if (selectionData[i] == 0 && state[i] > 0) {
                    state[i] = 0;
                }
            }
        }

        else if (capacity >= minSelected) {
            //We can assign the new flavor the minimum current
            console.log("assigning minimum current");
            for (let i = 0; i < selectionData.length; i++) {
                if (selectionData[i] > 0 && state[i] == 0) {
                    state[i] = minSelected;
                } else if (selectionData[i] == 0 && state[i] > 0) {
                    state[i] = 0;
                }
            }
        }

        else  {
            //We assign remaining capacity to the new flavor
            console.log("assigning remaining capacity");
            let newAmount = capacity;

            for (let i = 0; i < selectionData.length; i++) {
                if (selectionData[i] > 0 && state[i] == 0) {
                    state[i] = capacity;
                } else if (selectionData[i] == 0 && state[i] > 0) {
                    state[i] = 0;
                }
            }
        }

        // if (capacity < initialAdd && priorSelected < nowSelected) {
        //     //Flavors are increasing but we have limited capacity.
        //     //We have to move some ingredients around.
        //
        //     if (maxSelected <= initialAdd) {
        //         //Flavors are really spread out so we have to balance.
        //         console.log("Full n-recipe. Balancing.");
        //         let subtracted = 0;
        //         for (let i = 0; i < selectionData.length; i++) {
        //             if (selectionData[i] > 0 && state[i] == 0) {
        //                 //New item. We add something.
        //                 state[i] = initialAdd;
        //             } else if (selectionData[i] > 0 && state[i] > 1 && subtracted < initialAdd) {
        //                 //Existing item. We still have stuff we need to take out. We subtract.
        //                 state[i]--;
        //                 subtracted++;
        //             }
        //         }
        //
        //     } else {
        //         //There's a clear dominant so we don't have to balance.
        //         console.log("Full n-recipe with dominant. Shifting.");
        //         let maxAltered = false;
        //         for (let i = 0; i < selectionData.length; i++) {
        //             if (selectionData[i] > 0 && state[i] == 0) {
        //                 //New item. We add something.
        //                 state[i] = initialAdd;
        //             } else if (selectionData[i] > 0 && state[i]  == maxSelected && !maxAltered) {
        //                 //Existing item. We still have stuff we need to take out. We subtract.
        //                 state[i] -= initialAdd;
        //                 maxAltered = true;
        //             }
        //         }
        //     }

        // } else {
        //     //General case
        //     console.log("General n-recipe.");
        //     for (let i = 0; i < selectionData.length; i++) {
        //         if (selectionData[i] > 0 && state[i] == 0) {
        //             state[i] = 2;
        //         } else if (selectionData[i] == 0 && state[i] > 0) {
        //             state[i] = 0;
        //         }
        //     }

        if (nowSelected == maxFlavors) {
            action = "FreezeOptions";
        }
    } else if (nowSelected > maxFlavors) {
        action = "FreezeOptions";
        console.log("Too many flavors active! How did this happen?")
    }

    updateUI();

    // if (capacity == 0) {
    //     action = "FreezeOptions";
    // }

    var message = {
        action: action,
        selection: state
    };
    window.parent.postMessage(message,"*");
    selected = nowSelected;
}

function updateUI() {

    controls.remove();
    controls = draw.group();

    capacity = units;
    for (let i = 0; i < state.length; i++) {
        capacity -= state[i];
    }

    // if (capacity > 0) {
    //     helpText.text("You have ");
    //     helpText.build(true);
    //     helpText.tspan(""+capacity).fill('Green');
    //     if (capacity ==1 ) {
    //         helpText.tspan(" part left to add");
    //     } else {
    //         helpText.tspan(" parts left to add");
    //     }
    //     helpText.build(false);
    //
    //     // message = "You have "+capacity+" parts left to add"
    // } else {
    //     message = "Reduce flavors to change the balance"
    //     helpText.text(message);
    // }

    // const bottleSide = 600;
    // const bottleImLeft = 580;
    // const bottleImTop = -45;
    // const levelInc = 32;
    // const bottleBottom = (units*levelInc) + 98;
    // const bottleRectLeft = 766;
    // const bottleWidth = 178;
    // const iconMax = 160;
    // // const bottleRight = bottleRectLeft + bottleWidth;
    //
    // bottleBack = controls.rect(450,550);
    // bottleBack.fill('#F7F7F7');
    // bottleBack.move(bottleImLeft+100,bottleImTop);
    //
    // var level = 0;
    // var element = yPos-1;
    // // for (let i = 0; i < state.lengh; i++) {
    // for (let i = state.length-1; i >= 0; i--) {
    //
    //     if (state[i] > 0) {
    //         let rectHeight = state[i]*levelInc;
    //         let rectTop = bottleBottom-(rectHeight+level);
    //
    //         rect = controls.rect(bottleWidth,rectHeight-2);
    //         // rect.fill('#ECF2F9');
    //         rect.fill('#DCE2F9');
    //         rect.move(bottleRectLeft,rectTop);
    //
    //         level += rectHeight;
    //         element--;
    //     }
    // }
    //
    // let bottle = controls.image(assets+"border-bottle.png",550,550);
    // bottle.move(bottleImLeft,bottleImTop);
    //
    // var level = 0;
    // var element = yPos-1;
    // for (let i = state.length-1; i >= 0; i--) {
    //
    //     if (state[i] > 0) {
    //         let rectHeight = state[i]*levelInc;
    //         let rectTop = bottleBottom-(rectHeight+level);
    //
    //         let imSide = Math.min(iconMax, rectHeight);
    //         let imLeft = bottleRectLeft + (bottleWidth-imSide)/2;
    //         let imTop = rectTop + (rectHeight - imSide)/2;
    //         let im = controls.image(assets+optionData[i].image,imSide,imSide);
    //         im.move(imLeft, imTop);
    //
    //         let labelText = controls.text(optionData[i].name);
    //         let length = labelText.length();
    //         let adjust = (imSide - length)/2;
    //         labelText.font({family:'Helvetica',size:20})
    //         labelText.fill("Gray");
    //         labelText.move(imLeft+adjust+1,1+imTop+(imSide/2)-10);
    //
    //         let labelText2 = controls.text(optionData[i].name);
    //         labelText2.font({family:'Helvetica',size:20})
    //         labelText2.fill("White");
    //         labelText2.move(imLeft+adjust,imTop+(imSide/2)-10);
    //
    //         level += rectHeight;
    //         element--;
    //     }
    // }

    const rowTop = 0;
    const rowHeight = 100;
    const textWidth = 100;
    const textTop = 36;
    const textLeft = 170;
    const iconTop = 0;
    const iconLeft = 0;//80;
    const iconSide = 80;
    const dotGap = 30;
    const diameter = 24;
    const sliderHeight = 14;
    const dotLeft = 280;
    const dotTop = 40;
    const borderLeft = 100;
    const borderExtra = 180;

    var yPos = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] > 0) {

            let icon = controls.image(assets+optionData[i].image,iconSide,iconSide);
            icon.move(iconLeft,yPos*rowHeight);

            let text = controls.text(optionData[i].name).move(textLeft, textTop + yPos*rowHeight);
            text.fill('Black');

            for (let j = 0; j < units; j++) {

                let rect;
                // if (j == state[i] - 1) {

                // rect = controls.rect(rowHeight, rowHeight);
                rect = controls.circle(diameter);
                // rect.stroke({color: 'Black', width: 2})

                let rectLeft = dotLeft+j*dotGap;
                let rectTop = dotTop + yPos*rowHeight;
                let dotXAdjust = (dotGap - diameter)/2;
                let dotYAdjust = -(diameter - sliderHeight)/2;

                rect.move(rectLeft + dotXAdjust,rectTop + dotYAdjust);

                // } else {
                //     rect = controls.rect(dotGap,sliderHeight);
                //     rect.move(dotLeft+j*dotGap,dotTop + yPos*rowHeight);
                // }

                let highlightOn = true;
                if (j < state[i]) {
                    rect.fill('#52009A');
                    rect.click(function() {updateState(i,j+1)});
                    rect.style('cursor', 'pointer');
                } else if (j < state[i]+capacity){
                    rect.fill('White');
                    rect.stroke({color:'Silver',width:1});
                    rect.click(function() {updateState(i,j+1)});
                    rect.style('cursor', 'pointer');
                } else {
                    highlightOn = false;
                    rect.fill('DimGray');
                }

                if (highlightOn) {
                    let highlight = controls.circle(4);
                    highlight.move(dotLeft+(j+0.5)*dotGap-2,dotTop+yPos*rowHeight+sliderHeight/2-2);
                    // highlight.fill(optionData[i].color);
                    highlight.fill('none');
                    rect.mouseover(function() {highlight.animate(5).fill('Silver')});
                    // rect.mouseout(function() {highlight.animate(5).fill(optionData[i].color)});
                    rect.mouseout(function() {highlight.animate(5).fill('none')});
                    highlight.click(function() {updateState(i,j+1)});
                }
            }

            const partsTDown = 5;
            let separatorRight = borderLeft + (units*dotGap) + borderExtra;

            let partString = "/"+units+" Parts";
            // if (state[i]>1) partString += "s";
            let partsText = controls.text(state[i]+partString);
            partsText.fill('#333333');
            partsText.font({'size':20});
            let partsTLeft = separatorRight - (partsText.length()+4);
            partsText.move(partsTLeft,(yPos*rowHeight)+partsTDown);

            const delTLeft = (units*dotGap) + 220;
            const delTDown = 70;

            let delText = controls.text("Remove");
            delText.fill('Gray');
            delText.font({'size':14});
            delText.move(delTLeft,(yPos*rowHeight)+delTDown);

            delText.click(function() {updateState(i,0)});
            delText.style('cursor', 'pointer');
            delText.mouseover(function() {delText.animate(5).fill('Black')});
            delText.mouseout(function() {delText.animate(5).fill('Gray')});

            let separator = controls.line(
                borderLeft,
                (yPos+1)*rowHeight,
                separatorRight,
                (yPos+1)*rowHeight);
            separator.stroke({color:'Silver', width:1});

            yPos++;
        }
    }

    if (capacity == units) {

        helpText.text("");

        let startText1 = controls.text("");
        startText1.font({family:'Helvetica',size:20});
        startText1.build(true);
        startText1.tspan("Get started").fill('#52009A').font({weight:'bold'});
        startText1.tspan(" by selecting some flavorings");
        startText1.build(false);
        startText1.move(120,140+60);

        let startText2 = controls.text("for your vodka above...")
        startText2.font({family:'Helvetica',size:20});
        startText2.move(200,170+60);

        let startIcon = controls.image(assets+"/mix.png",100,100);
        startIcon.move(240,200+60);

        let arrowIcon = controls.image(assets+"/arrow.png",160,160);
        arrowIcon.move(360,-30+60);
    }
    // controls.move(0,rowTop);
}

function updateState(i, j) {
    console.log("updateState i:"+i+" j:"+j);
    state[i] = j;

    let nowSelected = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] > 0) nowSelected++;
    }

    updateUI();

    let action = "UpdateRecipe";
    // if (capacity == 0) {
    //     action = "FreezeOptions";
    // } else
    if (nowSelected >= maxFlavors) {
        action = "FreezeOptions";
    } else
    if (j == 0) {
        action = "RemoveIngredient";
    }

    var message = {
        action: action,
        selection: state
    };
    window.parent.postMessage(message,"*");
}
