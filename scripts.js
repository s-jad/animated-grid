const children = document.querySelectorAll('[id^="child-"]');
const container = document.querySelector('.container');

let gridRect = container.getBoundingClientRect();
let gridRectPosition = {
    top: gridRect.top,
    left: gridRect.left,
    bottom: gridRect.bottom,
    right: gridRect.right,
}

let rowWidth = (gridRectPosition.bottom - gridRectPosition.top) / 6;
let colWidth = (gridRectPosition.right - gridRectPosition.left) / 6;


// Resize gridRect, rowWidth and colWidth if window resizes
window.addEventListener("resize", function() {
    gridRect = container.getBoundingClientRect();
    gridRectPosition = {
        top: gridRect.top,
        left: gridRect.left,
        bottom: gridRect.bottom,
        right: gridRect.right,
    }

    rowWidth = (gridRectPosition.bottom - gridRectPosition.top) / 6;
    colWidth = (gridRectPosition.right - gridRectPosition.left) / 6;
});

console.table(`Container position => ${gridRectPosition}`);
console.log(`Column width => ${colWidth}`);
console.log(`Row width => ${rowWidth}`);

function generateRandomGridColumns() {
    let randA = Math.floor(Math.random() * 7) + 1;
    const randB = Math.floor(Math.random() * 7) + 1;

    while (randA === randB) {
        randA = Math.floor(Math.random() * 7) + 1;
    }

    return { randA, randB };
}

function generateRandomGridRows() {
    let randA = Math.floor(Math.random() * 7) + 1;
    const randB = Math.floor(Math.random() * 7) + 1;

    while (randA === randB) {
        randA = Math.floor(Math.random() * 7) + 1;
    }

    return { randA, randB };
}


children.forEach(function(childEl) {
    childEl.addEventListener("click", function() {
        // Generate random new rows and columns
        const newGridRow = generateRandomGridRows();
        const newGridColumn = generateRandomGridColumns();

        // Calculate future size, top and left of childEl
        let newChildWidth;
        let newChildHeight;
        let newChildTop;
        let newChildLeft;

        if (newGridRow.randA > newGridRow.randB) {
            newChildHeight = (newGridRow.randA - newGridRow.randB) * rowWidth;
            newChildTop = (newGridRow.randB * rowWidth) - rowWidth;
        } else {
            newChildHeight = (newGridRow.randB - newGridRow.randA) * rowWidth;
            newChildTop = (newGridRow.randA * rowWidth) - rowWidth;
        }

        if (newGridColumn.randA > newGridColumn.randB) {
            newChildWidth = (newGridColumn.randA - newGridColumn.randB) * colWidth;
            newChildLeft = (newGridColumn.randB * colWidth) - colWidth;
        } else {
            newChildWidth = (newGridColumn.randB - newGridColumn.randA) * colWidth;
            newChildLeft = (newGridColumn.randA * colWidth) - colWidth;
        }

        console.log(`new width => ${newChildWidth}`);
        console.log(`new height => ${newChildHeight}`);
        console.log(`new top => ${newChildTop}`);
        console.log(`new left => ${newChildLeft}`);

        // Stops childEl from covering whole viewport when in pos: absolute mode
        const currentWidth = window.getComputedStyle(childEl).width;
        const currentHeight = window.getComputedStyle(childEl).height;
        childEl.style.height = currentHeight;
        childEl.style.width = currentWidth;

        // Stops childEl from shooting to the top left of the screen before animation starts
        const rect = childEl.getBoundingClientRect();
        const currentX = rect.left;
        const currentY = rect.top;

        // Stops childEl positioning from affecting the other elements
        childEl.style.position = "absolute";
        childEl.style.top = `${currentY}px`;
        childEl.style.left = `${currentX}px`;

        // Prepare animation
        const animationName = `childAnimation_${Date.now()}`;
        const animationDuration = "1000ms";
        const animationTransition = "cubic-bezier(.26,.44,.83,.58)";
        const animationKeyframes = `
            @keyframes ${animationName} {
                0% {
                    top: ${currentY}px;
                    left: ${currentX}px;
                    width: ${currentWidth};
                    height: ${currentHeight};
                }
                100% {
                    top: ${newChildTop}px;
                    left: ${newChildLeft}px;
                    width: ${newChildWidth}px;
                    height: ${newChildHeight}px;
                }
            }
        `;

        // Append animation to the stylesheet
        const styleSheet = document.createElement("style");
        styleSheet.innerHTML = animationKeyframes;
        document.head.appendChild(styleSheet);

        childEl.style.animation = `${animationName} ${animationDuration} ${animationTransition}`;

        childEl.addEventListener("animationend", function() {
            // Reset child style values
            childEl.style.height = "100%";
            childEl.style.width = "100%";
            childEl.style.position = "static";

            // Calculate childs new position within the grid
            if (newGridRow.randA > newGridRow.randB) {
                childEl.style.gridRow = `${newGridRow.randB} / ${newGridRow.randA}`;
            } else {
                childEl.style.gridRow = `${newGridRow.randA} / ${newGridRow.randB}`;
            }
            if (newGridColumn.randA > newGridColumn.randB) {
                childEl.style.gridColumn = `${newGridColumn.randB} / ${newGridColumn.randA}`;
            } else {
                childEl.style.gridColumn = `${newGridColumn.randA} / ${newGridColumn.randB}`;
            }

            // Stop the stylesheets from piling up
            if (styleSheet.parentNode) {
                styleSheet.parentNode.removeChild(styleSheet);
            }
        });
    });
});
