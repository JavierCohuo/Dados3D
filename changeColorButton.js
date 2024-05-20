document.addEventListener("DOMContentLoaded", function() {
    const changeColorButton = document.getElementById('changeColorButton');

    changeColorButton.addEventListener('click', changeDiceColor);

    function changeDiceColor() {
        const cubes = document.querySelectorAll('.cubo3D'); 

        cubes.forEach(cube => {
            const faces = cube.querySelectorAll('.cara'); 

            faces.forEach(face => {
                const randomColor = getRandomColor();
                face.style.backgroundColor = randomColor;
            });
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
