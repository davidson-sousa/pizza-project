let modalQt = 1;
let modalKey = 0;
let cart = [];

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        e.preventDefault();
        
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; 
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;       
        c('.pizzaInfo--size.selected').classList.remove('selected');
        c('.pizzaInfo--qt').innerHTML = modalQt;
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
        });

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex'; 

        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1; 
        }, 50);              
    });

    c('.pizza-area').append(pizzaItem);
});

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none'; 
    }, 500);     
}

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {    
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;            
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let foundItem = cart.findIndex((item) => item.identifier == identifier);

    if (foundItem > -1){
        cart[foundItem].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
}); 

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = 0;
    }    
});

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }    
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';  
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        let subtotal = 0;
        let discount = 0;
        let total = 0;

        c('.cart').innerHTML = '';        

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;   
            
            subtotal += (pizzaItem.price * cart[i].qt);

            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            
            cartItem.setAttribute('data-key', cart[i].identifier);         
            cartItem.querySelector('img').src = pizzaItem.img;   
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', (e) => {
                let identifier = e.target.closest('.cart--item').getAttribute('data-key');              
                let itemFound = cart.findIndex((item) => item.identifier == identifier);
                
                if (cart[itemFound].qt > 1) {    
                    cart[itemFound].qt--;                    
                    // c(`[data-key="${identifier}"] .cart--item--qt`).innerHTML = cart[itemFound].qt;            
                } else {
                    cart.splice(itemFound, 1);
                }

                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', (e) => {
                let identifier = e.target.closest('.cart--item').getAttribute('data-key');
                let itemFound = cart.findIndex((item) => item.identifier == identifier);

                cart[itemFound].qt++;
                updateCart();
                // c(`[data-key="${identifier}"] .cart--item--qt`).innerHTML = cart[itemFound].qt;
            });            

            c('.cart').append(cartItem);            
        }
        
        discount = subtotal * 0.1;
        total = subtotal - discount;
        
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;        
        c('aside').classList.add('show');
    } else {
        c('aside').style.left = '100vw';
        c('aside').classList.remove('show');
    }
}