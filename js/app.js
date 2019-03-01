window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    paper.setup(canvas);
    
    const water = new Water(50);
    paper.view.draw();

    paper.view.onResize = function(event) {
        
        water.width = paper.view.viewSize.width;
        water.height = paper.view.viewSize.height;

        water.resize();
        console.log('Resize window');
    };

    paper.view.onFrame = function(event) {
        water.update(event);
    };

    paper.view.onKeyDown = function(event) {
        if (event.key === 'space') {
            for (var i = 0; i < 10; i++) {
                water.splash(20 + i, 50);
            }
            down = true;
        }
    };
}
