
/**
 *  CANVAS
 */


//  const canvasWrap = document.createElement('canvas');


function canvas_init() {
  // const canvas = document.getElementById("canvas");
  canvasWrap = document.getElementById("canvas-wrap");
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvasWrap.append(canvas);



  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 3;
  
  const ctx = canvas.getContext("2d");
  
  console.log( "canvas_init", "canvas.width:", canvas.width, "canvas.height:", canvas.height, "accentColor:", accentColor, "accentHoverColor", accentHoverColor);
  
  var startTranslateX = 5;
  var startTranslateY = 28;
  
  var firstSegmentColor   = accentColor;
  var secondSegmentColor  = accentHoverColor;
  var startPoint  = { x: canvas.width - startTranslateX, y: startTranslateY };
  var algoHeight  = (canvas.width - startTranslateX) / 1.56;
  
  var segmentsWidth = 350;
  var startPointX = canvas.width -5;
  var startPointY = 28;
  var startPointTranslateX = 5;
  var startPointTranslateY = 28;
  
  function breakPoints() {
    if(window.innerWidth >= 580) {
      segmentsWidth = 440;
      startPointTranslateY = 38;
    };
    if(window.innerWidth >= 768) {
      segmentsWidth = 550;
      startPointTranslateY = 42;
    };
    if(window.innerWidth >= 1280) {
      segmentsWidth = 620;
      startPointTranslateY = 50;
    };
  
    drawSegments(startPointTranslateX, startPointTranslateY, firstSegmentColor, secondSegmentColor, segmentsWidth);
  }
  breakPoints();
  
  
  
  function drawSegments(startPointTranslateX, startPointTranslateY, color1, color2 ,width) {
    var algoHeight  = (canvas.width - startPointTranslateX) / 1.56;
    var x = canvas.width - startPointTranslateX;
    var y = startPointTranslateY;
    
    // верхний
    ctx.beginPath();
    ctx.fillStyle = color1;
    ctx.moveTo(x, y); // точка 1 начало
    ctx.lineTo(0, y - algoHeight ); // точка 2
    ctx.lineTo(0, y - algoHeight + width ); // точка 3
    ctx.lineTo(x, y  + width ); // точка 4
    ctx.closePath();
    ctx.fill();
  
    // нижний ОК
    ctx.beginPath();
    ctx.fillStyle = color2;
    ctx.moveTo(x, y); // точка 1 начало
    ctx.lineTo(0, y + algoHeight );  // 2 точка 
    ctx.lineTo(0, y + algoHeight + width ); // точка 3
    ctx.lineTo(x, y  + width ); // точка 4
    ctx.closePath();
    ctx.fill();
      
  }
 
  window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 3;
    startPoint  = { x: canvas.width - startTranslateX, y: startTranslateY };
    console.log("resize!", canvas.width, canvas.height, startPoint);
  
    breakPoints();
  });

}
canvas_init();