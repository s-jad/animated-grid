const children = document.querySelectorAll('[id^="child-"]');
const container = document.querySelector('.container');

let gridRect = container.getBoundingClientRect();
let gridRectPosition = {
    top: gridRect.top,
    left: gridRect.left,
    bottom: gridRect.bottom,
    right: gridRect.right,
}

let gridStyles = window.getComputedStyle(container);

// Get the grid-template-columns and grid-template-rows values
let gridColumnTemplate = gridStyles.gridTemplateColumns;
let gridRowTemplate = gridStyles.gridTemplateRows;
let gridGap = gridStyles.columnGap.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));

// Extract the width values from grid-template-columns
let gridColumnWidths = gridColumnTemplate.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));

// Extract the height values from grid-template-rows
let gridRowHeights = gridRowTemplate.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));

// Take one of the height/width values to represent all rows/columns
let rowHeight = gridRowHeights[0];
let colWidth = gridColumnWidths[0];

// Extract the px value for the containers padding
let containerPaddingArr = gridStyles.paddingTop.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));
let containerPadding = containerPaddingArr[0];

// Resize gridRect, rowHeight, colWidth, gridGap and containerPadding if window resizes
window.addEventListener("resize", function() {
    gridRect = container.getBoundingClientRect();
    gridRectPosition = {
        top: gridRect.top,
        left: gridRect.left,
        bottom: gridRect.bottom,
        right: gridRect.right,
    }

    gridStyles = window.getComputedStyle(container);

    gridColumnTemplate = gridStyles.gridTemplateColumns;
    gridRowTemplate = gridStyles.gridTemplateRows;

    gridColumnWidths = gridColumnTemplate.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));
    gridRowHeights = gridRowTemplate.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));
    gridGap = gridStyles.columnGap.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));

    rowHeight = gridRowHeights[0];
    colWidth = gridColumnWidths[0];

    containerPaddingArr = gridStyles.paddingTop.match(/\d+(\.\d+)?px/g).map(value => parseFloat(value));
    containerPadding = containerPaddingArr[0];
});


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

        // EXAMPLE CALCULATIONS FOR HEIGHT AND TOP 
        //
        // height: grid-template-rows = 2/4, rowHeight = 70px, gap = 5px, padding = 7.08
        //  => (4 - 2) * 70 + 5 = 145px
        //
        // top: same gtr, rowHeight, gap and padding
        //  => (2 * 70) - 70 + ((2-1) * 5) + 7.08 = 82.08px  
        if (newGridRow.randA > newGridRow.randB) {
            const gapBufferTop = (newGridRow.randB - 1) * gridGap;
            const gapBufferHeight = ((newGridRow.randA - newGridRow.randB) - 1) * gridGap;
            newChildHeight = (newGridRow.randA - newGridRow.randB) * rowHeight + gapBufferHeight;
            newChildTop = (newGridRow.randB * rowHeight) - rowHeight + gapBufferTop + containerPadding;
        } else {
            const gapBufferTop = (newGridRow.randA - 1) * gridGap;
            const gapBufferHeight = ((newGridRow.randB - newGridRow.randA) - 1) * gridGap;
            newChildHeight = (newGridRow.randB - newGridRow.randA) * rowHeight + gapBufferHeight;
            newChildTop = (newGridRow.randA * rowHeight) - rowHeight + gapBufferTop + containerPadding;
        }

        if (newGridColumn.randA > newGridColumn.randB) {
            const gapBufferLeft = (newGridColumn.randB - 1) * gridGap;
            const gapBufferWidth = ((newGridColumn.randA - newGridColumn.randB) - 1) * gridGap;
            newChildWidth = (newGridColumn.randA - newGridColumn.randB) * colWidth + gapBufferWidth;
            newChildLeft = (newGridColumn.randB * colWidth) - colWidth + gapBufferLeft + (containerPadding * 2) + 2;
        } else {
            const gapBufferLeft = (newGridColumn.randA - 1) * gridGap;
            const gapBufferWidth = ((newGridColumn.randB - newGridColumn.randA) - 1) * gridGap;
            newChildWidth = (newGridColumn.randB - newGridColumn.randA) * colWidth + gapBufferWidth;
            newChildLeft = (newGridColumn.randA * colWidth) - colWidth + gapBufferLeft + (containerPadding * 2) + 2;
        }

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
        const animationTransition = "cubic-bezier(.43,.22,.43,.92)";
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
