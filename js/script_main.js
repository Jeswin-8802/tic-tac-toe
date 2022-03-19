const tile1 = document.getElementById('t1')
const tile2 = document.getElementById('t2')
let ai

tile1.addEventListener('click', function select() {
    handleClick('3x3')
})
tile2.addEventListener('click', function select() {
    handleClick('4x4')
})

function handleClick(kind) {
    tile1.innerHTML = 'vs Player'
    tile2.innerHTML = 'vs Computer'
    tile1.style.backgroundColor = 'black'
    tile2.style.backgroundColor = 'black'
    tile1.style.borderRadius = '5%'
    tile2.style.borderRadius = '5%'
    tile1.style.fontSize = '35px'
    tile2.style.fontSize = '35px'
    tile1.addEventListener('click', function type() {
        ai = false
        sessionStorage.setItem("first", ai);
        sessionStorage.setItem("second", kind);
        location.href = kind + '.html'
    })
    tile2.addEventListener('click', function type() {
        ai = true
        sessionStorage.setItem("first", ai);
        sessionStorage.setItem("second", kind);
        location.href = kind + '.html'
    })    
}
