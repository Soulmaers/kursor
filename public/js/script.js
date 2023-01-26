const detaly = document.querySelector('.detaly');

detaly.addEventListener('click', detalyFn)
function detalyFn(e) {
    e.preventDefault();
    detalisation = document.querySelector('.detalisation');
    wrapperLeft = document.querySelector('.wrapper_left');
    wrapperRigth = document.querySelector('.wrapper_right');
    detalisation.style.display = 'flex';
    wrapperLeft.style.display = 'none';
    wrapperRigth.style.display = 'none';

}