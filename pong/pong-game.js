function PongGame(canvas) {
    const FRAMES_PER_SECOND = 60;
    const FRAME_RATE_ADJUST = 30 / FRAMES_PER_SECOND;

    const WINNING_SCORE = 10;
    const PADDLE_THICKNESS = 10;
    const PADDLE_HEIGHT = 100;
    const COMPUTER_MOVE_SPEED = 6 * FRAME_RATE_ADJUST;

    this.canvas = canvas;

    var canvasContext = canvas.getContext('2d');

    var ballX = 100 , ballY = 100;
    var ballSpeedX = 10 * FRAME_RATE_ADJUST, ballSpeedY = 4 * FRAME_RATE_ADJUST;
    var player1Score = 0, player2Score = 0;
    var paddle1Y = 250, paddle2Y = 250;
    var showingWinScreen = false;

    // analytics
    var startTime = new Date().getTime();
    var totalFramesRendered = 0;
    var avgFrameRate = 0;

    setInterval(function () {
        moveEverything();
        drawEverything();
        // analytics
        totalFramesRendered ++;
        avgFrameRate = Math.round(totalFramesRendered / ((new Date().getTime() - startTime) / 1000) * 10) / 10.0;
        canvasContext.font = "10px Arial";
        canvasContext.fillText(avgFrameRate + 'fps', canvas.width - 50, 10);
    }, 1000 / FRAMES_PER_SECOND);

    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    function calculateMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    function handleMouseClick(evt) {
        if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    }

    function handleMouseMove(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    }

    /**
     * Restart the ball from the center of the screen
     */
    function ballReset() {
        if (player1Score >= WINNING_SCORE ||
                player2Score >= WINNING_SCORE) {
            showingWinScreen = true;
        }

        ballSpeedX = -ballSpeedX;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    /**
     * Move the computer player's paddle
     */
    function computerMovement() {
        var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
        if (paddle2YCenter < ballY - 35) {
            paddle2Y = paddle2Y + COMPUTER_MOVE_SPEED;
        } else if (paddle2YCenter > ballY + 35) {
            paddle2Y = paddle2Y - COMPUTER_MOVE_SPEED;
        }
    }

    function moveEverything() {
        if (showingWinScreen) {
            return;
        }
        computerMovement();

        ballX = ballX + ballSpeedX;
        ballY = ballY + ballSpeedY;

        if (ballX < PADDLE_THICKNESS &&
                ballY > paddle1Y &&
                ballY < paddle1Y + PADDLE_HEIGHT) {
            // hit the left paddle
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35 * FRAME_RATE_ADJUST;
        } else if (ballX < 0){
            // went off
            player2Score++; // must be BEFORE ballReset()
            ballReset();
        }
        
        if (ballX > canvas.width - PADDLE_THICKNESS &&
                ballY > paddle2Y &&
                ballY < paddle2Y + PADDLE_HEIGHT) {
            // hit the right paddle
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35 * FRAME_RATE_ADJUST;
        } else if (ballX > canvas.width) {
            // went off
            player1Score++; // must be BEFORE ballReset()
            ballReset();
        }

        if (ballY < 0) {
            // hit the top wall
            ballSpeedY = -ballSpeedY;
        }
        if (ballY > canvas.height) {
            // hit the bottom wall
            ballSpeedY = -ballSpeedY;
        }
    }

    function drawNet() {
        for (var i = 0; i < canvas.height; i += 40) {
            colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
        }
    }

    function drawEverything() {
        // next line blanks out the screen with black
        colorRect(0, 0, canvas.width, canvas.height, 'black');

        if (showingWinScreen) {
            canvasContext.fillStyle = 'white';

            if (player1Score >= WINNING_SCORE) {
                canvasContext.fillText("Left Player Won", 350, 200);
            } else if (player2Score >= WINNING_SCORE) {
                canvasContext.fillText("Right Player Won", 350, 200);
            }

            canvasContext.fillText("click to continue", 350, 500);
            return;
        }

        drawNet();

        // this is left player paddle
        colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

        // this is right computer paddle
        colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

        // next line draws the ball
        colorCircle(ballX, ballY, 10, 'white');

        canvasContext.font = "20px Arial";
        canvasContext.fillText(player1Score, 100, 100);
        canvasContext.fillText(player2Score, canvas.width - 100, 100);
    }

    function colorCircle(centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    function colorRect(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
    }
}
